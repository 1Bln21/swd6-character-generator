<?php
/* =====================================================================
   Per-installation settings - copy to  api/config.local.php
   ---------------------------------------------------------------------
   Everything in this file overrides the $CONFIG block at the top of
   api/index.php. The point is that index.php is replaced on every update
   while this file stays where it is, so the database password does not
   have to be typed in again each time.

   It matters most when one database server carries more than one
   installation - a live site and a beta, say. The schema is migrated on
   EVERY request (CREATE TABLE IF NOT EXISTS, ALTER TABLE ADD COLUMN), so
   an index.php uploaded to the beta with the live credentials still in it
   would have the first visitor rebuild the live tables. With the
   credentials out here that cannot happen: each installation keeps its
   own file, and an update never touches it.

   Only the keys named here are replaced. 'db' is merged key by key, so
   naming just the database name is enough when host, user and password
   are the same.

   This file is a .php file on purpose: fetched over the web it executes
   and prints nothing. A .ini or .json next to it would be handed out as
   plain text, password and all.
   ===================================================================== */
return [
  'db' => [
    'host' => 'localhost',
    'name' => 'beta',
    'user' => 'swd6gen',
    'pass' => 'PASSWORT-HIER',
  ],

  // Useful on a beta: keep it out of the search engines' way and make the
  // authenticator entry distinguishable from the live one.
  // 'issuer' => 'SWD6 Generator (Beta)',

  // A beta is usually not meant to be open to everyone.
  // 'register_mode'  => 'approval',
  // 'register_code'  => 'nur-fuer-tester',
];
