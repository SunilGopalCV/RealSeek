# RealSeek CodedTools package
import asyncio
import time
import threading
import os
import langchain

print("⚡ RealSeek: Applying Mistral AI global rate-limiting monkey-patch...")

# Set up Langchain persistent SQLite cache to cache identical agent queries (like relevance checks)
try:
    from langchain.cache import SQLiteCache
    cache_db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend", ".langchain_cache.db")
    langchain.llm_cache = SQLiteCache(database_path=cache_db_path)
    print(f"📦 RealSeek: Global SQLite Langchain cache activated at: {cache_db_path}")
except Exception as e:
    try:
        from langchain_community.cache import SQLiteCache
        cache_db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend", ".langchain_cache.db")
        langchain.llm_cache = SQLiteCache(database_path=cache_db_path)
        print(f"📦 RealSeek: Global SQLite Langchain cache activated via community module at: {cache_db_path}")
    except Exception as ex:
        print(f"⚠️ RealSeek Warning: Could not initialize SQLite Cache: {ex}")

from langchain_mistralai.chat_models import ChatMistralAI

# Save references to original methods
original_agenerate = ChatMistralAI._agenerate
original_generate = ChatMistralAI._generate

# Global thread lock to serialize calls across concurrent event loops/threads
mistral_sync_lock = threading.Lock()

class AsyncThreadLock:
    """Async context manager wrapper for threading.Lock to avoid loop-mismatch errors."""
    def __init__(self, lock):
        self.lock = lock
    async def __aenter__(self):
        await asyncio.to_thread(self.lock.acquire)
        return self
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        self.lock.release()

async def patched_agenerate(self, *args, **kwargs):
    for attempt in range(6):
        try:
            async with AsyncThreadLock(mistral_sync_lock):
                # Enforce spacing delay of 1.5s since single-agent direct search mode is extremely lightweight
                await asyncio.sleep(1.5)
            # Run the network request outside the lock to allow parallel processing
            return await original_agenerate(self, *args, **kwargs)
        except Exception as e:
            e_str = str(e)
            is_rate_limit = "429" in e_str or "rate limit" in e_str.lower() or "resource_exhausted" in e_str.lower()
            is_conn_error = "timeout" in e_str.lower() or "connect" in e_str.lower() or "connection" in e_str.lower()
            
            if is_rate_limit or is_conn_error:
                wait_time = 15 + 10 * attempt
                print(f"⚠️ RealSeek Connection/Rate-Limit: Mistral error in _agenerate. Retrying attempt {attempt+1}/6 in {wait_time}s... Error: {e_str}")
                await asyncio.sleep(wait_time)
            else:
                raise e
    # Final fallback attempt
    return await original_agenerate(self, *args, **kwargs)

def patched_generate(self, *args, **kwargs):
    for attempt in range(6):
        try:
            with mistral_sync_lock:
                # Enforce spacing delay of 1.5s since single-agent direct search mode is extremely lightweight
                time.sleep(1.5)
            # Run the network request outside the lock to allow parallel processing
            return original_generate(self, *args, **kwargs)
        except Exception as e:
            e_str = str(e)
            is_rate_limit = "429" in e_str or "rate limit" in e_str.lower() or "resource_exhausted" in e_str.lower()
            is_conn_error = "timeout" in e_str.lower() or "connect" in e_str.lower() or "connection" in e_str.lower()
            
            if is_rate_limit or is_conn_error:
                wait_time = 15 + 10 * attempt
                print(f"⚠️ RealSeek Connection/Rate-Limit: Mistral error in _generate. Retrying attempt {attempt+1}/6 in {wait_time}s... Error: {e_str}")
                time.sleep(wait_time)
            else:
                raise e
    # Final fallback attempt
    return original_generate(self, *args, **kwargs)

# Inject patched methods
ChatMistralAI._agenerate = patched_agenerate
ChatMistralAI._generate = patched_generate
print("✅ RealSeek: Mistral AI monkey-patch successfully installed.")
