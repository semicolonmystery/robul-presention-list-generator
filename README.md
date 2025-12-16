# Generátor Prezenční Listiny

React aplikace pro automatické generování prezenčních listin s vyplněnými daty podle zadaných vzorů. Aplikace vezme šablonu DOCX souboru, vyplní do něj data podle zadaného vzoru a vygeneruje jeden sloučený DOCX soubor se všemi stránkami.

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
5. **Generujte DOCX**: Klikněte na "Generovat DOCX"
6. **Konverze do PDF**: Otevřete vygenerovaný DOCX v Microsoft Word a exportujte jako PDF (volitelné)

## Funkce

- ✅ Více období s různými vzory
- ✅ Výběr konkrétních dní v týdnu (pondělí až neděle)
- ✅ Nastavitelný časový rozsah pro každé období
- ✅ Náhled generovaných dat před exportem
- ✅ Automatická náhrada "Datum:" v DOCX šabloně
- ✅ Jeden DOCX soubor se všemi stránkami sloučenými dohromady
- ✅ Zachování veškerého formátování, obrázků a stylů z původní šablony

## Příklad

**Období 1:**
- Od: 1.1.2025 Do: 31.1.2025
- Dny: Úterý, Čtvrtek
- Čas: 8:00 - 14:00

**Období 2:**
- Od: 1.2.2025 Do: 28.2.2025
- Dny: Pondělí, Středa, Pátek
- Čas: 9:00 - 15:00

Výsledek: Jeden DOCX soubor s vyplněnými daty ve formátu "Datum: 27.11.2025, 8:00 - 14:00 hod." na každé stránce.

## Vlastní šablona

Chcete-li použít vlastní šablonu:

1. Vytvořte nebo upravte DOCX soubor s textem "Datum:" na místě, kde chcete mít vyplněné datum
2. Uložte soubor jako `public/template.docx` (nahraďte stávající soubor)
3. Aplikace automaticky použije novou šablonu

**Důležité:** Text "Datum:" v šabloně bude nahrazen formátovaným datem a časem (např. "Datum: 27.11.2025, 8:00 - 14:00 hod.").

## Jak to funguje

1. Aplikace načte šablonu `public/template.docx` (původní soubor: `Prezencni listina_Robul.docx`)
2. Pro každé datum ve vybraném období vytvoří kopii šablony
3. V každé kopii nahradí text "Datum:" za formátované datum a čas
4. Všechny kopie sloučí do jednoho DOCX souboru
5. Výsledný soubor se stáhne do počítače

## Technologie

- React + Vite
- PizZip (manipulace s DOCX soubory)
- file-saver (stahování souborů)
