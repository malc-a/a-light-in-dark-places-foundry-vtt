#!/bin/sh
#
# A script to create a build of the "a-light-in-dark-places" system.
# Mostly, this consists of building LevelDB databases for the packs,
# everything else is just copied into the ./dist directory.

# Fake up having the bestiary and features packs in place
mkdir packs/bestiary packs/features 2>/dev/null || true

# Make the directories we're going to need
mkdir -p ./dist/packs

# Copy all the static content into the distribution directory
cp -pr README.md LICENSE.txt system.json template.json assets css fonts lang system templates dist

# We will need the classic-level JS library for building packs
npm install classic-level

# Now create the LevelDB files for the compendium packs
node build/jsontopack.mjs actors ./dist/packs ./packs/archetypes ./packs/bestiary
node build/jsontopack.mjs journal ./dist/packs ./packs/documentation
node build/jsontopack.mjs items ./dist/packs ./packs/features ./packs/gear ./packs/languages ./packs/problems ./packs/schools ./packs/skills ./packs/spells ./packs/talents
