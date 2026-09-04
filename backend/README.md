# Autókölcsönző backend API

## Publikus felület

### Autók lekérése

`GET /api/cars` - összes (nem deaktivált) autó lekérése

`GET /api/cars?startDate=...&endDate=...` - összes a `startDate` kezdetű és `endDate` végű időintervallumban elérhető autó lekérése

### Foglalás

`POST /api/bookings` - foglalás beküldése

#### Üzenettest:

- `car_id`: a foglalandó autó azonosítója (number)
- `start_date`: a foglalás első napja (string, ISO 8601 dátum)
- `end_date`: a foglalás utolsó napja (string, ISO 8601 dátum)
- `name`: a foglaló neve (string)
- `email`: a foglaló email címe (string)
- `address`: a foglaló címe (string)
- `phone`: a foglaló telefonszáma (string)

### Belépés

`POST /api/auth/login` - megfelelő adatok (username, password) esetén a válaszban token szerepel,
ami admin műveletekhez szükséges

## Admin felület

A végpontokhoz admin jogosultság szükséges (headerben `Authorization: Bearer` token).

### Lekérések

`GET /api/admin/cars` - összes autó lekérése

`GET /api/admin/bookings` - összes foglalás lekérése

### Autó szerkesztése, új autó létrehozása

`POST /api/admin/cars` - autó létrehozása

`PUT /api/admin/cars/:id` - meglévő autó adatainak cseréje az autó id alapján

#### Üzenettest az előző két végponthoz:

- `brand`: az autó márkája (string)
- `model`: az autó modellje (string)
- `passengers`: férőhelyek az autóban (number)
- `daily_price_huf`: az autó napi ára forintban (number)
- `image`: autó képéhez tartozó URL (string)
- `enabled`: az autó státusza (boolean)

### Autó státusz változtatása

`PUT /api/admin/cars/:id/status` - autó státusz változtatása autó id alapján (üzenettestben `enabled` boolean)

## Használat:

Az `application.properties` fájl nyomán az alkalmazás alapértelmezetten egy PostgreSQL adatbázishoz próbál csatlakozni egy `car_rental` nevű adatbázishoz `car_rental_user` felhasználónévvel és `car_rental_user_password` jelszóval, ennek előkészítése lehet például:

```sql
CREATE DATABASE car_rental;
CREATE USER car_rental_user WITH ENCRYPTED PASSWORD 'car_rental_user_password';
GRANT ALL PRIVILEGES ON DATABASE car_rental TO car_rental_user;
GRANT ALL ON SCHEMA public TO car_rental_user;
```

Futtatás: ./mvnw spring-boot:run
