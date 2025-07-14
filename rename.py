import os

direct = "src/assets/music"
with os.scandir(direct) as entries:
    for entry in entries:
        if entry.is_file():
            new_name = entry.name.replace(" ", "_")
            os.rename(f"src/assets/music/{entry.name}", new_name)