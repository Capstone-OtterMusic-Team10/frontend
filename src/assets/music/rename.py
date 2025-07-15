import os

direct = "src/assets/music"
with os.scandir(direct) as entries:

    for entry in entries:
        
        if entry.is_file() and entry.name.startswith("Ar"):
           print(f'import {entry.name[:-4]} from "../../assets/music/{entry.name}"')
