1. Install repo:
```sh
git clone https://github.com/tripchanski/BlackLock.git
```
2. Up containers:
```sh
docker compose up -d --build
```
3. Go to container:
```sh
docker exec -it blacklock-app-1 bash
```
4. Launch app:
```sh
npx expo start --tunnel
```

### For look preview in phone:

1. Install 'Expo Go' in AppStore/PlayStore.
2. Scan QR code which may be in your terminal when you launch app.
