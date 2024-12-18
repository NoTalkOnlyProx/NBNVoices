import {default as tmp} from 'tmp';
import {default as ffmpeg} from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

//GEN_SEQ creates 128 notes, all of equal length;
const notes = 128;

// Why can't this just be
// import {default as {WaveFile}} from 'wavefile'
// that would be so much cleaner for dealing with this nonsense.
// TypeScript has a conniption fit every time I have to use the const reassign.
import {default as wavefile} from 'wavefile';
const {WaveFile} = wavefile;

export async function slice(filename) {
    let full_wav = new WaveFile();
    full_wav.fromBuffer(fs.readFileSync(filename));
    const full_samples = full_wav.getSamples();
    const samples_per_note = full_samples[0].length/notes;

    let noteStoreMP3 = {};
    let noteStoreOGG = {};
    for (let n = 0; n < notes; n++) {
        console.log(`Slicing ${filename} note ${n}`);
        /* Slice the WAV data */
        const start = n*samples_per_note;
        const end = (n+1)*samples_per_note;
        let section_wav = new WaveFile();
        section_wav.fromScratch(
            full_wav.fmt.numChannels,
            full_wav.fmt.sampleRate,
            full_wav.bitDepth,
            full_samples.map(stream => stream.slice(start, end))
        );

        /* Save temporary file with WAV data */
        const tmpwav = tmp.fileSync();
        fs.writeFileSync(tmpwav.name, section_wav.toBuffer());

        /* Convert to temporary mp3 and ogg files */
        const tmpmp3 = tmp.fileSync();
        const tmpogg = tmp.fileSync();
        await ffmpegToWav(tmpwav.name, tmpmp3.name);
        await ffmpegToOgg(tmpwav.name, tmpogg.name);

        /* Convert to URI encoded base64 */
        const wavData = fs.readFileSync(tmpmp3.name);
        noteStoreMP3[noteName(n)] = "data:audio/mp3;base64," + wavData.toString('base64');

        const oggData = fs.readFileSync(tmpogg.name);
        noteStoreOGG[noteName(n)] = "data:audio/ogg;base64," + oggData.toString('base64');

        /* Cleanup */
        tmpwav.removeCallback();
        tmpmp3.removeCallback();
        tmpogg.removeCallback();
    }

    /* Regex removes numeric prefixes, and anything not alphanumeric or underscore */
    const fontname = path.basename(filename, '.wav').replace(/(^[0-9]*|[^a-zA-Z0-9_])/g,"");

    writeSoundFont(fontname, noteStoreMP3, "mp3");
    writeSoundFont(fontname, noteStoreOGG, "ogg");
}

function writeSoundFont(fontname, data, format) {
    /* The rather accursed thing is that `smplr` converts this JS file back into a JSON object
     * with just the contents of noteStore upon loading the .js URL.
     * We could hypothetically have just used JSON the whole time, but smplr does things this way
     * for compatibility reasons, and therefore so do I!
     */
    fs.writeFileSync(`fonts/${fontname}_${format}.js`,
        "if (typeof(MIDI) === 'undefined') var MIDI = {};\n" +
        "if (typeof(MIDI.Soundfont) === 'undefined') MIDI.Soundfont = {};\n" +
        /* Regex replace call here inserts comma before closure of exterior object.
         * This is required by the smplr JSON extractor.
         * Regex is not the an appropriate tool for this,
         * but it is the most convenient for me in this particular situation.
         */
        `MIDI.Soundfont.${fontname} = ${JSON.stringify(data).replace(/\}$/, ",}")}`
    );
}

async function ffmpegToWav(inf, outf) {
    return await ffmpegToFormat(inf, outf, "mp3", "libmp3lame");
} 

async function ffmpegToOgg(inf, outf) {
    return await ffmpegToFormat(inf, outf, "ogg", "libvorbis");
}

function ffmpegToFormat(inf, outf, format, codec) {
    return new Promise((resolve, reject) => {
        ffmpeg(inf)
            .format(format)
            .audioCodec(codec)
            .on('end', () => {
                resolve();
            })
            .on('start', function(line) {
                console.log('ffmpeg command: ' + line);
            })
            .save(outf);
    });
}       

function noteName(n) {
    const noteNames = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    return noteNames[n%noteNames.length] + Math.floor(n/noteNames.length);
}
