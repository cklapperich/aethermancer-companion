# Finding Your Aethermancer Save Files

## Steam Userdata Location

Steam stores cloud-synced save files in the `userdata` folder. The location varies by operating system:

### Linux
```
~/.steam/steam/userdata/<YOUR_USER_ID>/
```
or
```
~/.steam/debian-installation/userdata/<YOUR_USER_ID>/
```

### Windows
```
C:\Program Files (x86)\Steam\userdata\<YOUR_USER_ID>\
```

### macOS
```
~/Library/Application Support/Steam/userdata/<YOUR_USER_ID>/
```

## Finding Your Steam User ID

Your Steam User ID is a numeric folder inside the `userdata` directory. If you have multiple Steam accounts, there may be multiple folders. You can find your ID by:

1. Opening Steam and clicking your profile name
2. Selecting "View Profile"
3. Looking at the URL - it contains your Steam ID

## Aethermancer Save Location

Aethermancer uses **App ID 2288470**. Your save files are located at:

```
<STEAM_USERDATA>/<YOUR_USER_ID>/2288470/remote/
```

### Save File Names

- `1_aethermancer.game` - Save Slot 1
- `2_aethermancer.game` - Save Slot 2
- `3_aethermancer.game` - Save Slot 3
- `settings.game` - Game settings

### Example Full Path (Linux)
```
~/.steam/debian-installation/userdata/96057826/2288470/remote/1_aethermancer.game
```

## File Format

Save files are JSON formatted text files with the `.game` extension. You can open them with any text editor or JSON viewer.
