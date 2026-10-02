# -*- coding: utf-8 -*-
"""Stamp the app version onto every script and stylesheet the pages pull.

   The pages are never cached, the files they pull are cached for a year
   (see the .htaccess). What makes an update arrive is therefore the address
   itself: "app.js?v=4.0.0.5.3" is a different file to the browser than
   "app.js?v=4.0.0.5.2", so a release is fetched once and then left alone.

   A page left behind on the old number would keep handing out year-old
   scripts, and nothing would ever correct it. That failure is silent, which
   is why this runs as part of the release and why --check exists: it is the
   one step that must not be done by hand.

   Usage:
       python tools/version-assets.py            # rewrite the pages
       python tools/version-assets.py --check    # exit 1 if any is stale

   Line endings are left exactly as they are found - the repository is CRLF
   and a rewrite that quietly converted it would show up as a diff of the
   whole file.
"""
import os
import re
import sys

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# src="foo.js" and href="foo.css", optionally with a ?v= already on them.
# Anything with a scheme, a leading slash or a "data:" payload is somebody
# else's address and is left alone.
MUSTER = re.compile(r'(\s(?:src|href)=")([^"?#:/][^"?#:]*\.(?:js|css))(\?v=[^"#]*)?(")')


def version():
    pfad = os.path.join(WURZEL, 'credits.js')
    text = open(pfad, encoding='utf-8', newline='').read()
    m = re.search(r"^const APP_VERSION = '([^']+)'", text, re.M)
    if not m:
        raise SystemExit('APP_VERSION not found in credits.js')
    return m.group(1)


def seiten():
    return sorted(f for f in os.listdir(WURZEL) if f.endswith('.html'))


def main(pruefen):
    v = version()
    stempel = '?v=' + v
    schief = []
    geaendert = []
    for name in seiten():
        pfad = os.path.join(WURZEL, name)
        alt = open(pfad, encoding='utf-8', newline='').read()
        neu = MUSTER.sub(lambda m: m.group(1) + m.group(2) + stempel + m.group(4), alt)
        anzahl = len(MUSTER.findall(alt))
        if neu != alt:
            schief.append('%s (%d Verweise)' % (name, anzahl))
            if not pruefen:
                open(pfad, 'w', encoding='utf-8', newline='').write(neu)
                geaendert.append(name)
        else:
            print('%-14s %3d Verweise, bereits auf %s' % (name, anzahl, v))

    if pruefen:
        if schief:
            print('\nVERALTET - diese Seiten zeigen nicht auf %s:' % v)
            for s in schief:
                print('  ' + s)
            print('\nBeheben mit: python tools/version-assets.py')
            return 1
        print('\nAlle Seiten zeigen auf %s.' % v)
        return 0

    for name in geaendert:
        print('%-14s auf %s gesetzt' % (name, v))
    print('\n%d Seite(n) geschrieben, Stand %s.' % (len(geaendert), v))
    return 0


if __name__ == '__main__':
    sys.exit(main('--check' in sys.argv))
