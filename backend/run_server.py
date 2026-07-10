# RealSeek Custom Backend Runner (Applies rate-limiting patches on startup)
import os
import sys

# Ensure PYTHONPATH is used to find coded_tools
script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if script_dir not in sys.path:
    sys.path.insert(0, script_dir)

# Import coded_tools immediately to apply the Mistral AI monkey-patch on startup
try:
    import coded_tools
except Exception as e:
    print(f"⚠️ RealSeek Warning: Could not preload coded_tools: {e}")

# Call the original neuro_san_studio CLI main
from neuro_san_studio.commands.cli import main

if __name__ == "__main__":
    main()
