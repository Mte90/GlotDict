# GlotDict
[![License](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://img.shields.io/badge/License-GPL%20v2-blue.svg) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/e9107b200511490a961560efcf7c5d1c)](https://www.codacy.com/app/mte90net/GlotDict?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Mte90/GlotDict&amp;utm_campaign=Badge_Grade)  

[https://translate.wordpress.org](https://translate.wordpress.org) enable to the users to translate plugin, themes and WordPress itself.  
This extension implements many new feature to improve the quality of translation and speed up that process!

PS: If you are using NoScript or Privacy Badger enable the domain wordpress.org else the extension will not work!.

# Features

* Daily update of the list of locales
* Click on the terms with glossary open the consistency tool
* Add link to the Translation Status Overview with a button to scroll to the language in use
* More warning on translations
  * Validation for final "...", ".", ":"
  * Validation for final ;.!:、。؟？！
  * First letter in translation is not uppercase but the original string is
  * Detect first and last character if they are space
  * Missing term translated using the locale glossary
  * Check for curly apostrophe 
  * Check for non typographic quotes
* Review to trigger potential warnings and indicate warnings count via notice.
* New column with fast Approve/Reject/Fuzzy for strings
* 'Copy from Original' Bulk Action with setting to enable auto-submit and force auto-submit.
* Bulk Actions also introduced in the footer
* Mark old string (6 months) with a black border
* Highlight non-breaking-space
* Character and Word Counts in Meta
* Notices with counts for Approved, Rejected, Fuzzied, Submitted and Selected rows
* Many hotkeys and shortcut

## Hotkeys

* Shortcut on Ctrl+Enter to click "Suggest new translation" or "Add translation"
* Shortcut on Ctrl+Shift+Enter to double click "Suggest new translation" or "Add translation" to force submission.
* Shortcut on Ctrl+Shift+Z to click "Cancel".
* Shortcut on Ctrl+Shift+A to click "Approve".
* Shortcut on Ctrl+Shift+R to click "Reject".
* Shortcut on Ctrl+Shift+F to click "Fuzzy".
* Shortcut on Ctrl+Shift+B to "Copy from original".
* Shortcut on Ctrl+Shift+N to add non-breaking spaces near symbols.
* Shortcut on Ctrl+Shift+R to reset all the GlotDict settings.
* Shortcut on Ctrl+D to dismiss the validation warnings for the currently visible editor.
* Shortcut on Ctrl+Shift+D to dismiss all the validation warnings.
* Shortcut on Page Down to open the previous string to translate.
* Shortcut on Page Up to open the next string to translate.
* Right click of the mouse on the term with a dashed line and the translation will be added in the translation area.

## Settings
* Don’t validate strings ending with “...“, “.”, “:”
* Don’t validate strings ending with ;.!:、。؟？！
* Don’t show a warning when the translation doesn't contain an initial uppercase letter when the original string starts with one.
* Don’t show a warning when the translation is missing a glossary term.
* Don’t visualize non-breaking-spaces in preview.
* Hide warning for initial space in translation.
* Hide warning for trailing space in translation.
* Show a warning for missing curly apostrophe in preview.
* Show a warning for using non-typographic quotes in preview (except for HTML attributes quotes).
* Auto-submit the "Copy From Original" Bulk Action (Warning: When enabled will submit all originals).
* Don’t validate strings during "Copy From Original" Bulk Action to bypass validation. (Warning: When enabled will submit originals with Glossary terms or other warnings.)

# Download

* Firefox [Instruction](https://support.mozilla.org/en-US/kb/find-and-install-add-ons-add-features-to-firefox): [Download](https://addons.mozilla.org/it/firefox/addon/glotdict/)
* Chrome [Instructions](https://support.google.com/chrome_webstore/answer/2664769?hl=en): [Download](https://chrome.google.com/webstore/detail/glotdict/jfdkihdmokdigeobcmnjmgigcgckljgl)

# Spell Checking?

If you are looking for spell checking we recommend [Grammarly](https://www.grammarly.com/) and [LanguageTool](https://languagetool.org/) as they both provide browser extensions for spelling and grammar checking.

# Update times and release

When the developer of the extension think that a new release is ready and tested they create a new release and publish on Firefox and Chrome addons store.  
After that step we have to wait few hours for Chrome and for Firefox and all the installations will be updated automatically.

# Additional resources

## Video

* [GlotDict – How a Browser Extension Changes Your Translation Workflow](https://wordpress.tv/2016/05/31/daniele-scasciafratte-glotdict-how-a-browser-extension-changes-your-translation-workflow/) ([Daniele Scasciafratte](https://github.com/Mte90))
* [GlotDict, Pte-Bot and BulkRejectGP – Why Your Community Needs A Glossary](https://wordpress.tv/2017/04/29/glotdict-pte-bot-and-bulkrejectgp-why-your-community-needs-a-glossary/) ([Daniele Scasciafratte](https://github.com/Mte90))

## Presentations

* [Translating english variants with GlotDict](https://docs.google.com/presentation/d/1MiJNsbv1oIIlq5tj1P-lkc5y_F4JO3mFVNwk45XevtU/present) ([Garrett Hyder](https://github.com/garrett-eclipse)) 

# Contributors

## Mantainers

* [Daniele Scasciafratte](https://github.com/Mte90) [Donate](https://www.paypal.me/mte90)
* [Jb Audras](https://github.com/audrasjb) 
* [Garrett Hyder](https://github.com/garrett-eclipse) 

## Other contributors

* [Olegs Belousovs](https://github.com/sgelob) - The ideator
* [Pascal Casier](https://github.com/ePascalC) - For the help with the glossaries and hotkeys
* [Aurélien Joahny](https://github.com/ajoah) - For all the patches
* [Loïc Antignac](https://github.com/webaxones) - For the help
