# Generátor Prezenční Listiny

React aplikace pro automatické generování prezenčních listin s vyplněnými daty podle zadaných vzorů.

## Instalace

```bash
npm install
```

## Spuštění

```bash
npm run dev
```

Aplikace se otevře na `http://localhost:5173/`

## Použití

1. **Nastavte období**: Vyberte datum od a datum do
2. **Vyberte dny v týdnu**: Zaškrtněte dny, kdy chcete generovat stránky (např. pouze úterý)
3. **Nastavte čas**: Zadejte časový rozsah (např. 8:00 - 14:00)
4. **Přidejte další období**: Klikněte na "+ Přidat další období" pro více vzorů s různými časy
5. **Generujte PDF**: Klikněte na "Generovat PDF"

## Funkce

- ✅ Více období s různými vzory
- ✅ Výběr konkrétních dní v týdnu
- ✅ Nastavitelný časový rozsah
- ✅ Náhled generovaných dat
- ✅ Automatická náhrada "Datum:" v PDF
- ✅ Jeden PDF soubor se všemi stránkami

## Příklad

**Období 1:**
- Od: 1.1.2025 Do: 31.1.2025
- Dny: Úterý, Čtvrtek
- Čas: 8:00 - 14:00

**Období 2:**
- Od: 1.2.2025 Do: 28.2.2025
- Dny: Pondělí, Středa, Pátek
- Čas: 9:00 - 15:00

Výsledek: PDF s vyplněnými daty ve formátu "Datum: 27.11.2025, 8:00 - 14:00 hod."

## Technologie

- React + Vite
- pdf-lib (manipulace s PDF)
