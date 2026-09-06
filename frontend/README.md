# Egyszerű autókölcsönző alkalmazás

## Használat

Node.js szükséges

- `npm install`
- `npm run build`
- `npm run preview`

---

## Publikus felület

A felületen lehetőség van keresni az autók között: a daterange picker használatával a kiválasztott időtartamra még foglalható autókat tudjuk szűrni.

A listázott autók adatait láthatjuk:

- Márka, modell, férőhelyek
- Napi ár
- Kép

A megfelelő autó foglalás gombjára kattintva átkerülünk a foglalás oldalára, ahol a foglaláshoz szükséges adatokat kell megadni:

- Név
- E-mail cím
- Cím
- Telefonszám
- Foglalandó napok

A foglalás várható teljes összegét is láthatjuk. A gombbal tudjuk véglegesíteni és elküldeni a rendelést.

### Belépés

A megfelelő felhasználónév és jelszó megadása esetén a belépés gombra kattintva használhatjuk az admin felületet.

## Admin felület

Az admin felületen minimális adminisztrációs tevékenységek folytathatók.

Láthatjuk a foglalásokat és azok adatait:

- Foglalt autó ID
- Foglalás időtartama
- Foglaló neve,
- email címe,
- címe,
- telefonszáma
- Foglalás teljes összege

Az autók itt is listázva vannak, azok foglalhatóságától függetlenül. A megfelelő gombra kattintva szerkeszteni tudjuk egy autó adatait. Új autó felvételére is van lehetőség. Mindkettő esetben egy olyan felületre kerülünk, ahol az autó összes adatát meg lehet adni.