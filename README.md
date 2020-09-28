# Ergodox Macro Hax

This is a quick and dirty script to nicely get around the annoying (though reasonable) limitation of Ergodox / Moonlander keyboards in the Oryx configurator where macros can only be 4 key sequences for security reasons.

This hack is a post-processor that'll take your raw "Source" Oryx configuration and extend your macros to be any arbitrary sequence.

# Complete configuration flow

## 1. Configuring with Oryx

Configure in Oryx just as you normally would, except make sure each macro you'd like to extend beyond 4 button presses is a unique set of alphanumeric button presses that act as a unique ID to find in post-processing.  Let's say you want a keyboard to type "whale", you could just write a macro with keys "whal" or get really detailed with numeric IDs and type "1234".  Remember these IDs for later.  DO NOT use any key modifiers, custom delays or non-alphanumeric keys in your extendable macros, you can specify those yourself later.

When done, download the "Source" (don't download the compiled binary), unzip it and note the directory where you unzipped it to.

## 2. Create a mapping in this script

Install on the command line (with Node.js installed) using:

```
cd path/to/ergodox-macro-hax

npm install
```

Grab my-illicit-macros.ts and change it to what you need, starting with the absolute directory path `SOURCE_DIR` pointed to the unzipped directory that contains the "keymap.c" file (NOT usually in the root directory!) you noted in step 1.  Now open my-illicit-macros.ts and modify to match your configuration.

Here's an example of creating an extended (more than 4 button) macro:

```
const macro = newMacro()
    .typeAlphanumeric("function") // Supports a-z and 0-9
    .sendRawCmd("SS_DELAY(100)") // Raw commands in the C file
    .tapKey("X_SPACE") // Tap a raw key code
    .delay(50) // Delay for 50 ms
```

Now just map the original 4 character macro to your newer, longer macro.  See what's already in my-illicit-macros.ts for fuller examples.

## 3. Run the post-processor

Run `npm run hax` to modify your config and extend your macros.

## 4. Build Modified Source and Flash it!

Use the normal ZSA Wally software to compile and flash.

## Note: Figuring out key codes

I'm too lazy to list them for you, when I need a keycode such as "X_SPACE", I just put it in a macro and find it in the keymap.c file, then reference that name from then on out.
