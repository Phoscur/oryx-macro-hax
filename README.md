# Ergodox Macro Hax

This is a quick and dirty script to nicely get around the annoying (though reasonable) limitation of Ergodox / Moonlander keyboards in the Oryx configurator where macros can only be 4 key sequences for security reasons.

This hack is a post-processor that'll take your raw "Source" Oryx configuration and extend your macros to be any arbitrary sequence.

# Complete configuration flow

## 0. Initial setup

To compile the firmware, setup the [ZSA QMK Fork with guide referenced](https://github.com/zsa/qmk_firmware)

`qmk setup zsa/qmk_firmware -b firmware22`

Install on the command line (with Node.js installed) using:
```
cd ~/qmk_firmware
git clone <your fork of this repo>
cd ergodox-macro-hax
npm install
```


## 1. Configuring with Oryx

Configure in Oryx just as you normally would, except make sure each macro you'd like to extend beyond 4 button presses is a unique set of alphanumeric button presses that act as a unique ID to find in post-processing.  Let's say you want a keyboard to type "whale", you could just write a macro with keys "whal" or get really detailed with numeric IDs and type "1234".  Remember these IDs for later.  DO NOT use any key modifiers, custom delays or non-alphanumeric keys in your extendable macros, you can specify those yourself later.

When done, take a note of the `layout hash ID` in the URL or download the source manually into the `keymap_src` folder.
Copy `.env.dist` and creating a `.env` file with your configuration.

It is also recommended to `git branch <your layout name>` and gitignore allowlist `!layout_src/<your layout name>` (don't merge this branch into your main branch).

## 2. Create a mapping in this script


```
cd ~/qmk_firmware/ergodox-macro-hax
npm run get -- <oryxLayoutHashId>
```

Grab macros.ts or example and change it to what you need

Here's an example of creating an extended (more than 4 button) macro:

```
const macro = newMacro()
    .typeAlphanumeric("function") // Supports a-z and 0-9
    .sendRawCmd("SS_DELAY(100)") // Raw commands in the C file
    .tapKey("X_SPACE") // Tap a raw key code
    .delay(50) // Delay for 50 ms
```

Now just map the original 4 character macro to your newer, longer macro.  See what's already in my-macros.ts for fuller examples.

If you want to run a macro on a double tap or other state, the UI does not let you do this. To add a macro to a dance program the states with a letter. For example on my 2nd layer I have mapped the G key on the board to be A when tapped, held, double tapped and then tapped and held. The following macros will replace the letter A in the dance section with the macro you want. If you have more than the 26 letters you are getting too complex :)

The name of the macro tells the system what to replace. always start with 'dance_' then type of tap and finally letter as per the example below.

```
    "dance_SINGLETAP_A": newMacro()
        .typeAlphanumeric("git status"),
    "dance_SINGLEHOLD_A": newMacro()
        .typeAlphanumeric("git log"),
    "dance_DOUBLETAP_A": newMacro()
        .typeAlphanumeric("ls -al"),
    "dance_DOUBLEHOLD_A": newMacro()
        .typeAlphanumeric("cp ../moonlander_hacked.bin /mnt/c/tools/"),

```



## 3. Run the post-processor

Run to modify your config and extend your macros. By default layoutFolderName is 'moonlander_default-layout_source'

```
cd ~/qmk_firmware/ergodox-macro-hax
npm run hax -- <layoutFolderName>
```

Run `npm run copy` to copy the processed keymap to the parent keymaps folder (../keyboards/moonlander/keymaps/hacked).

## 4. Build Modified Source and Flash it!

Use the normal QMK/ZSA Wally software to compile and flash.

`npm run compile`
or
`qmk compile -kb moonlander -km hacked`

Flash.... TBD

If you want Github to build the firmware for you, create repository action secrets `LAYOUT_ID`, set it to the hashId of your layout keymap, as well as `LAYOUT_FOLDER` with the name of the folder of your keymap in the source archive.
(Extract it from your ORYX link: `https://configure.zsa.io/moonlander/layouts/<hashId>/latest/0`) then you can use [Github Actions](./.github/workflows/process.yml) to build the firmware for you.

## Note: Figuring out key codes

I'm too lazy to list them for you, when I need a keycode such as "X_SPACE", I just put it in a macro and find it in the keymap.c file, then reference that name from then on out.
