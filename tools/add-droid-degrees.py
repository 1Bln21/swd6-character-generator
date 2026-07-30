#!/usr/bin/env python3
"""Traegt den Grad (1st..5th Degree) in pdfdata-droids.js nach.

Warum ein eigenes Werkzeug?
    Das "Droid Compendium" (rp_droids.pdf) nennt den Grad nicht im Statblock,
    sondern als Kapitelueberschrift: "1st Degree Droids", "2nd Degree Droids"
    usw. Der Statblock-Parser in extract-from-pdfs.py sieht davon nichts, weil
    er blockweise arbeitet. Deshalb laeuft dieses Skript NACH der Extraktion und
    bestimmt den Grad ueber die Seite, auf der ein Droide beschrieben wird.

    Droiden aus anderen Quellen (Galaxy Guide 16, KotOR, Legacy Era, ...) haben
    keine solche Kapitelstruktur. Fuer sie wird der Grad aus den belegten
    Eintraegen gelernt (Naive Bayes ueber Name, Typ, Fertigkeiten, Ausruestung)
    und mit "degreeDerived": true markiert, damit die Oberflaeche sie als
    Naeherung ausweisen kann (Kennzeichen in der Vorlagenliste).

    Gemessen per 5-facher Kreuzvalidierung auf den belegten Eintraegen: rund
    77 % Trefferquote - deutlich besser als die frueher benutzte handgeschriebene
    Stichwortliste (53 %), aber eben keine Buchangabe.

Aufruf (Probelauf zeigt nur an, --write schreibt):
    python tools/add-droid-degrees.py "<Pfad zu rp_droids.pdf>" [--write]

Nach jedem Voll-Neulauf von extract-from-pdfs.py erneut ausfuehren.
"""
import io, json, math, os, random, re, sys
from collections import Counter, defaultdict

import pypdf

HEAD = 'const PDF_DROIDS = '
DEGREES = ['First Degree', 'Second Degree', 'Third Degree', 'Fourth Degree', 'Fifth Degree']
DEGREE_NAME = {'1st': DEGREES[0], '2nd': DEGREES[1], '3rd': DEGREES[2],
               '4th': DEGREES[3], '5th': DEGREES[4]}
BOOK = 'Droid Compendium'          # so nennt der Extraktor rp_droids.pdf

norm = lambda x: re.sub(r'[^a-z0-9]', '', x.lower())


def chapter_bounds(pages):
    """Seitenbereiche je Grad. Das Inhaltsverzeichnis fuehrt alle fuenf
    Ueberschriften auf einer Seite - solche Seiten werden uebersprungen."""
    pat = re.compile(r'(1st|2nd|3rd|4th|5th)\s*Degree\s*Droids', re.I)
    starts = {}
    for i, t in enumerate(pages):
        hits = {m.group(1).lower() for m in pat.finditer(t)}
        if len(hits) == 1:
            starts.setdefault(hits.pop(), i)
    keys = [(k, starts[k]) for k in ['1st', '2nd', '3rd', '4th', '5th'] if k in starts]
    return [(deg, p0, keys[n + 1][1] if n + 1 < len(keys) else len(pages))
            for n, (deg, p0) in enumerate(keys)]


def tokens(d):
    txt = (d.get('name', '') + ' ' + str(d.get('type', ''))[:200] + ' '
           + ' '.join(d.get('skills') or [])[:200] + ' '
           + ' '.join(d.get('equipped') or [])[:150])
    stop = set('the and for with a an of to in on is are droid droids unit units'.split())
    return [w for w in re.findall(r'[a-z]{3,}', txt.lower()) if w not in stop]


def train(items):
    prior, cond, total, vocab = Counter(), defaultdict(Counter), Counter(), set()
    for d in items:
        g = d['degree']; prior[g] += 1
        for w in tokens(d):
            cond[g][w] += 1; total[g] += 1; vocab.add(w)
    return prior, cond, total, vocab


def predict(model, d):
    prior, cond, total, vocab = model
    V = len(vocab) or 1
    n = sum(prior.values()) or 1
    best, score = None, -1e18
    for g in DEGREES:
        if not prior[g]:
            continue
        sc = math.log(prior[g] / n)
        for w in tokens(d):
            sc += math.log((cond[g][w] + 1) / (total[g] + V))
        if sc > score:
            best, score = g, sc
    return best


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        print(__doc__); return 1
    pdf_path = args[0]
    catalog = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                           'pdfdata-droids.js')

    pages = [(p.extract_text() or '') for p in pypdf.PdfReader(pdf_path).pages]
    bounds = chapter_bounds(pages)
    if len(bounds) != 5:
        print('Nur %d Kapitelueberschriften gefunden - Abbruch.' % len(bounds)); return 2
    print('Kapitelanfaenge (Seite):', {d: a + 1 for d, a, _ in bounds})
    page_norm = [norm(t) for t in pages]

    s = io.open(catalog, encoding='utf-8').read()
    i0 = s.index(HEAD) + len(HEAD); i1 = s.index('];', i0) + 1
    arr = json.loads(s[i0:i1])

    # 1) Grad aus dem Buch
    found = 0
    for d in arr:
        if d.get('book') != BOOK:
            continue
        key = norm(d.get('name', ''))
        if len(key) < 4:
            continue
        for i in range(bounds[0][1], len(pages)):
            if key in page_norm[i]:
                for deg, a, b in bounds:
                    if a <= i < b:
                        d['degree'] = DEGREE_NAME[deg]; d.pop('degreeDerived', None)
                        found += 1
                break
    print('aus dem Buch belegt:', found)

    # 2) Rest daraus lernen, vorher Guete messen
    labelled = [d for d in arr if d.get('degree') and not d.get('degreeDerived')]
    rest = [d for d in arr if not d.get('degree')]
    random.seed(42)
    pool = labelled[:]; random.shuffle(pool)
    correct = 0
    for f in range(5):
        test = pool[f::5]
        ids = {id(x) for x in test}
        m = train([d for d in pool if id(d) not in ids])
        correct += sum(1 for d in test if predict(m, d) == d['degree'])
    if pool:
        print('Kreuzvalidierung: %.0f%% (%d/%d)' % (100 * correct / len(pool), correct, len(pool)))

    m = train(labelled)
    cnt = Counter()
    for d in rest:
        g = predict(m, d)
        d['degree'] = g; d['degreeDerived'] = True
        cnt[g] += 1
    print('abgeleitet:', dict(cnt))

    if '--write' in sys.argv:
        io.open(catalog, 'w', encoding='utf-8').write(
            s[:i0] + json.dumps(arr, ensure_ascii=False, indent=1) + s[i1:])
        print('geschrieben:', catalog)
    else:
        print('(Probelauf - mit --write schreiben)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
