#!/usr/bin/env python3
"""Fill in the degree (1st..5th Degree) in pdfdata-droids.js.

Why a tool of its own?
    The "Droid Compendium" (rp_droids.pdf) does not name the degree in the
    statblock but as a chapter heading: "1st Degree Droids", "2nd Degree
    Droids" and so on. The statblock parser in extract-from-pdfs.py never
    sees those, because it works block by block. So this script runs AFTER
    the extraction and derives the degree from the page a droid appears on.

    Droids from other sources (Galaxy Guide 16, KotOR, Legacy Era, ...) have
    no such chapter structure. For them the degree is learned from the
    entries the book does document (naive Bayes over name, type, skills and
    equipment) and marked with "degreeDerived": true, so the interface can
    show them as an estimate (flagged in the template list).

    Measured by 5-fold cross-validation on the documented entries: roughly
    77 % accuracy - clearly better than the hand-written keyword list used
    before (53 %), but still not what the book says.

Usage (a dry run only reports, --write saves):
    python tools/add-droid-degrees.py "<path to rp_droids.pdf>" [--write]

Run again after every full re-run of extract-from-pdfs.py.
"""
import io, json, math, os, random, re, sys
from collections import Counter, defaultdict

import pypdf

HEAD = 'const PDF_DROIDS = '
DEGREES = ['First Degree', 'Second Degree', 'Third Degree', 'Fourth Degree', 'Fifth Degree']
DEGREE_NAME = {'1st': DEGREES[0], '2nd': DEGREES[1], '3rd': DEGREES[2],
               '4th': DEGREES[3], '5th': DEGREES[4]}
BOOK = 'Droid Compendium'          # what the extractor calls rp_droids.pdf

norm = lambda x: re.sub(r'[^a-z0-9]', '', x.lower())


def chapter_bounds(pages):
    """Page range per degree. The table of contents lists all five headings
    on one page - pages like that are skipped."""
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
        print('Only %d chapter headings found - giving up.' % len(bounds)); return 2
    print('Kapitelanfaenge (Seite):', {d: a + 1 for d, a, _ in bounds})
    page_norm = [norm(t) for t in pages]

    s = io.open(catalog, encoding='utf-8').read()
    i0 = s.index(HEAD) + len(HEAD); i1 = s.index('];', i0) + 1
    arr = json.loads(s[i0:i1])

    # 1) degree straight from the book
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

    # 2) learn the rest from those, measuring the accuracy first
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
        print('written:', catalog)
    else:
        print('(Probelauf - mit --write schreiben)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
