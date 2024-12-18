# NTOP SOUNDFONTS
This repository exists to host custom soundfonts for [NoteByNote](https://github.com/NoTalkOnlyProx/NoteByNote).

For my convenience, [Here is a link to the repo on github](https://github.com/NoTalkOnlyProx/NBNVoices)

No one ever does that for .io sites! lmao. Drives me nuts

# Contributing
Please feel free to contribute your own. Render `GEN_SEQ_120BPM.midi` at 120bpm into a .wav,
then use `slice.js` to convert into an instrument JS. See `Slicing` for details.

Please make sure that the sound has the same relative tuning as `simple_saw.wav` --
In other words, import that into your DAW and play it along-side the utility MIDI, and make sure
they are in tune with each other.

Generally, in Vital, this corresponds to a global transpose of -12.

As for loudness, I accidentally had normalization on when exporting the initial set of fonts,
whoops! If you can target about -20db integrated LUFs as measured by YouLean loudness meter,
that would be perfect I think. I will probably use that as the standard for new fonts.

Generally I would prefer simple sounds with clean fundamental frequencies for learning purposes.

(So, avoid stabs, chords, stuff that doesn't cleanly resolve to a single note in other words)

Submit a pull request with the above and I will likely accept.

# Use elsewhere

Please feel free to use or these in your own projects. I offer them up in the same spirit as
https://gleitz.github.io/midi-js-soundfonts/

For example, you can pass this to https://github.com/danigb/smplr

```
    https://notalkonlyprox.github.io/NBNVoices/fonts/vainotron_mp3.js
```

But if you use vainotron, please tell me, (I just want to see how it gets used)!
Actually if you use any of these, I'd love to know.
You can write a comment about it [here](https://github.com/NoTalkOnlyProx/NBNVoices/issues/1)



# Slicing

You must have ffmpeg installed.
In case there is a node version compatibility issue I am not aware of, I'm using `v22.6.0`.

Then use `node tools/slice.mjs path/to/wav/file.wav`.

For example, `node tools/slice.mjs raw/bitcrush_sine.wav`

A js file with the same name will be created in `fonts`.
