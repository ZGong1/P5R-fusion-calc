# Fusion Calculator Core - File Manifest

## Package Contents (Persona 5 Royal)

Total size: ~190KB

### Core Files (32KB)

| File | Size | Purpose | Dependencies |
|------|------|---------|--------------|
| `FusionCalculator.js` | 12KB | Main fusion calculator class with all fusion logic | DataUtil.ts |
| `DataUtil.js` | 2.5KB | Utility functions and data structure initialization | data/PersonaData.ts, data/Data5.ts |
| `README.md` | 15KB | Complete documentation and usage guide | None |
| `MANIFEST.md` | This file | File listing and dependency tree | None |

### Data Files (~158KB)

| File | Size | Purpose | Dependencies |
|------|------|---------|--------------|
| `data/PersonaDataRoyal.ts` | ~133KB | Royal persona data with traits & itemization (219 personas) | None |
| `data/Data5Royal.ts` | ~25KB | Royal fusion combos and special recipes | None |

## Dependency Tree

```
Your Project
├── data/PersonaDataRoyal.ts
│   └── Defines: PersonaData interface, personaMap (with Royal features)
│
├── data/Data5Royal.ts
│   └── Defines: rarePersonae, rareCombos, arcana2Combos, specialCombos
│
├── DataUtil.ts
│   ├── Requires: PersonaDataRoyal.ts, Data5Royal.ts
│   └── Exports: customPersonaList, customPersonaeByArcana, getResultArcana, special2Combos
│
└── FusionCalculator.ts
    ├── Requires: DataUtil.ts (which includes the data files)
    └── Exports: FusionCalculator class, Recipe interface
```

## What Each File Provides

### PersonaDataRoyal.ts
**Interfaces:**
- `PersonaMap` - Map of persona name to PersonaData

**Data:**
- `personaMap` - Complete database of all personas with:
  - Name, arcana, level
  - Base stats [Str, Mag, End, Agi, Luk]
  - Elemental affinities
  - Skills and learn levels
  - Special flags (rare, special, dlc)
  - Royal additions: traits, itemization

### Data5Royal.js
**Arrays/Objects:**
- `rarePersonae` - Array of 8 treasure demon names
- `rareCombos` - Object mapping arcanas to modifier arrays for rare fusion
- `arcana2Combos` - Array of 200+ valid arcana fusion combinations
- `specialCombos` - Array of special multi-persona fusion recipes (Alice, Yoshitsune, etc.)
- `dlcPersona` - Array of DLC persona sets (currently unused but potentially useful for DLC filtering/detection)
- `inheritanceChart` - Object mapping element types to skill inheritance patterns (currently unused but potentially useful for skill inheritance calculation)

### DataUtil.ts
**Functions:**
- `getResultArcana(arcana1, arcana2)` - Returns result arcana from fusing two arcanas

**Data Structures:**
- `customPersonaList` - Array of all PersonaData objects (with names set)
- `customPersonaeByArcana` - Object organizing personas by arcana, sorted by level
- `arcanaMap` - Quick lookup table for arcana fusions
- `special2Combos` - Filtered list of 2-persona special fusions

### FusionCalculator.ts
**Class: FusionCalculator**

*Public Methods:*
- `fuse(persona1, persona2): PersonaData | null`
  - Fuses two personas using normal, rare, or special fusion rules

- `getRecipes(persona): Recipe[]`
  - Returns all possible ways to create the given persona

- `getAllResultingRecipesFrom(persona): Recipe[]`
  - Returns all possible personas you can create using the given persona

*Private Methods:*
- `fuseNormal()` - Standard arcana-based fusion
- `fuseRare()` - Treasure demon fusion
- `getSpecialFuseResult()` - Check for 2-persona special fusions
- `getSpecialRecipe()` - Get recipe for special personas
- `getArcanaRecipes()` - Get all recipes for an arcana
- `isGoodRecipe()` - Validate recipe results
- `addRecipe()` - Add recipe with cost calculation
- `getApproxCost()` - Calculate fusion cost

**Interface: Recipe**
- `sources: PersonaData[]` - Array of source personas
- `result: PersonaData` - Resulting persona
- `cost?: number` - Approximate fusion cost in yen
- `isAllRare?: boolean` - Flag for rare-only fusions

## Usage Pattern

### Minimal Setup
```typescript
/// <reference path="data/PersonaDataRoyal.ts"/>
/// <reference path="data/Data5Royal.ts"/>
/// <reference path="DataUtil.ts"/>
/// <reference path="FusionCalculator.ts"/>

const calculator = new FusionCalculator(customPersonaeByArcana);
```

## Optional Modifications

### To Reduce Package Size
If you only need fusion logic and not full persona details:
1. Strip unnecessary fields from PersonaData (skills, elements, etc.)
2. Keep only: name, arcana, level, rare, special flags
3. Can reduce data files by ~70%

### To Add DLC Filtering
Modify DataUtil.ts line ~13-25 to add DLC filtering logic

### To Convert to ES6 Modules
Replace triple-slash directives with:
```typescript
import { PersonaData, personaMap } from './data/PersonaDataRoyal';
import { rareCombos, arcana2Combos, specialCombos } from './data/Data5Royal';
// etc.
```

## Missing from This Package

The following are NOT included (found in original source if needed):
- `SkillData.ts` - Skill database and effects
- `ItemData.ts` - Item database
- UI/Controller files
- Skill inheritance calculation logic
- Browser localStorage handling
- HTML/CSS/display logic

## Royal Features

This package includes Persona 5 Royal data with:

| Feature | Details |
|---------|---------|
| Personas | 232 total (includes DLC) |
| Arcanas | 22 (includes Faith & Councillor) |
| Traits | Yes - each persona has a unique trait |
| Itemization | Yes - persona → items/skill cards |
| Special Fusions | 25 unique recipes |
| Data File Size | ~158KB |
