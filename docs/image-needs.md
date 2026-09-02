# Image needs

Working list of every visual this platform needs, and — more importantly —
**what kind of asset each one has to be.** Getting that classification right
matters more than the image itself.

## The rule

An image in a trade reference makes a claim prose does not. A reader glances at
a photo of correctly banded pipework and copies it. They cannot tell the band
spacing is wrong, because not knowing that is why they are here.

So:

| Category | What it is for | Source |
|---|---|---|
| **Photo** | Recognising a real thing in the real world | Licensed photograph only. Never generated. |
| **Diagram** | Geometry, sequence, relationships | Original SVG, authored in this repo |
| **Illustration** | Atmosphere, chapter headers | May be AI-generated. Must teach nothing. |

**Never generate:** material identification, PPE, tools, defects, any procedure,
anything in a safety-critical chapter, anything with Japanese text in it.

A generated image of glass wool is a hallucination presented as evidence. The
entire job of that image is "this is what the real thing looks like," which is
the one thing a generated image cannot honestly do.

**Never generate images containing text.** Generators mangle lettering, and they
mangle Japanese badly. Labels go on in SVG afterwards, where they are also
translatable and searchable.

---

## Photographs needed

Sourcing: Wikimedia Commons, Openverse, openly-licensed government imagery.
Manufacturer product photos are copyrighted — do not use them.
Every file needs licence, author and source URL in `content/_images.json`
before it can be referenced.

### Chapter 06 — Materials (highest priority)

The single most valuable photo set on the platform. These four are starting
work in months and will be handed materials by name in a language they are
still learning.

- Glass wool pipe section, cut face visible
- Glass wool blanket roll
- Rock wool pipe section, for contrast against glass wool
- Cellular glass block or section
- Rigid polyurethane foam section
- Aluminium jacketing sheet, coil and flat
- Galvanised steel jacketing sheet
- Stainless jacketing sheet
- Aluminium foil facing / laminated kraft facing, close enough to see the layers
- Vapour barrier tape and mastic in their containers
- Galvanised tie wire and banding coil
- Self-tapping screws, pop rivets and banding seals side by side

### Chapter 07 — Tools

- Insulation knife and serrated blade types
- Tin snips, straight and offset left/right
- Hand seamer
- Crimping tool for jacketing
- Pop rivet gun
- Banding tensioner and sealer
- Dividers and scribe
- Wire twister / pliers used for tie wire

### Chapter 08 — PPE

Real photographs only. This is the chapter where a plausible fake is dangerous.

- Full body harness laid flat, showing D-ring positions
- Harness correctly worn, front and back
- Disposable respirator with its class marking legible
- Half-mask respirator with cartridges
- Cut-resistant gloves versus general handling gloves
- Safety glasses and goggles
- Helmet with chinstrap fastened

### Chapter 09 — Work at height

- Frame scaffold with guardrail and toe board in place
- Mobile tower scaffold
- Rolling ladder / stepladder correctly positioned
- Anchor point in use
- Japanese site guardrail and opening cover conventions, if a licensed image exists

### Chapter 01 — Site fundamentals

- Japanese construction site entrance and signage
- Morning assembly (朝礼) in progress
- KY activity (危険予知) board
- Helmet colour conventions on a Japanese site, if findable under licence

### Chapters 11 to 17 — Work in progress and finished

- Straight pipe insulation part-fitted, showing the joint
- Tie wire spacing on a finished run
- Metal jacketing with overlap visible on a horizontal run
- Jacketing on a vertical run
- Finished elbow with segmented jacketing
- Valve box, open and closed
- A correctly sealed vapour barrier on a cold line
- Corrosion under insulation, exposed — a real photograph, not a drawing

---

## Diagrams to author as SVG

These are geometry. I draw them, they live in the repo, they diff cleanly and
they cost a few kilobytes.

### Fundamentals

- Layer cross-section: pipe wall, insulation, vapour barrier, jacketing
- Heat flow through those layers, showing where the resistance actually sits
- Conduction, convection and radiation on one pipe
- Thermal resistance in series, as a stack
- Why a pipe is not a flat wall: outer surface area growing with thickness

### Craft geometry

- Elbow segmentation: gore count, cut angles, developed pattern
- Tee saddle development
- Reducer cone development
- Jacketing overlap direction on a horizontal run, showing water shedding
- Overlap direction on a vertical run
- Joint stagger between insulation layers
- Banding spacing and seal placement
- Thermal bridge at a pipe support, and how it is broken
- Penetration detail through a wall or floor

### Cold work

- Where condensation forms, and why the vapour barrier goes on the warm side
- Vapour barrier continuity at a joint, correct and incorrect side by side
- Cold bridge at a support on a chilled line

### Safety

- Harness attachment geometry: anchor above, fall distance, swing
- Fall clearance calculation, drawn
- Guardrail and toe board dimensions as a labelled schematic

Safety diagrams get drawn only from a cited source, never from memory, and
follow the same tier rule as safety text.

---

## Where generation is acceptable

Only these:

- Chapter header illustrations, abstract
- Background texture or pattern for the site
- Nothing else

If you generate something in this category, record it in the registry with
`origin: "generated"` and name the tool used. It stays out of anything
instructional.

---

## Format and budget

- Photographs: WebP, longest edge 1600 px, aim under 200 KB each
- Diagrams: SVG, using the site's own CSS variables so they theme correctly
- Keep the whole image directory under about 25 MB. Pages serves it free, but a
  large repo is slow to clone in a cloud session.

Every file, without exception, gets an entry in `content/_images.json` before it
can be referenced from content. The validator rejects unregistered images.
