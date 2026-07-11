# RealSeek CodedTools package
import os
import langchain

# Set up Langchain persistent SQLite cache to cache identical agent queries
try:
    from langchain.cache import SQLiteCache
    cache_db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend", ".langchain_cache.db")
    langchain.llm_cache = SQLiteCache(database_path=cache_db_path)
    print(f"[Cache] RealSeek: Global SQLite Langchain cache activated at: {cache_db_path}")
except Exception as e:
    try:
        from langchain_community.cache import SQLiteCache
        cache_db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend", ".langchain_cache.db")
        langchain.llm_cache = SQLiteCache(database_path=cache_db_path)
        print(f"[Cache] RealSeek: Global SQLite Langchain cache activated via community module at: {cache_db_path}")
    except Exception as ex:
        print(f"[Warning] RealSeek Warning: Could not initialize SQLite Cache: {ex}")
