# NTOP SOUNDFONTS
This repository exists to host custom soundfonts for [NoteByNote](https://github.com/NoTalkOnlyProx/NoteByNote).

# Contributing
Please feel free to contribute your own. Render `GEN_SEQ_120BPM.midi` at 120bpm into a .wav,
then use `slice.js` to convert into an instrument JS. See `Slicing` for details.

Please make sure that the sound has the same relative tuning as `simple_saw.wav` --
In other words, import that into your DAW and play it along-side the utility MIDI, and make sure
they are in tune with each other.

Generally, in Vital, this corresponds to a global transpose of -12.

Try to get the loudness about the same too

Generally I would prefer simple sounds with clean harmonics for learning purposes.

Submit a pull request with the above and I will likely accept.

# Use elsewhere

Please feel free to use or these in your own projects. I offer them up in the same spirit as
https://gleitz.github.io/midi-js-soundfonts/

But if you use vainotron, please tell me, (I just want to see how it gets used)!

# Slicing

You must have ffmpeg installed.
In case there is a node version compatibility issue I am not aware of, I'm using `v22.6.0`.

Then use `node tools/slice.mjs path/to/wav/file.wav`.

For example, `node tools/slice.mjs raw/bitcrush_sine.wav`

A js file with the same name will be created in `fonts`.
