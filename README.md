# GlotDict
[![License](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://img.shields.io/badge/License-GPL%20v2-blue.svg) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/e9107b200511490a961560efcf7c5d1c)](https://www.codacy.com/app/mte90/GlotDict?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Mte90/GlotDict&amp;utm_campaign=Badge_Grade)  

**GlotDict** extension implements many new features to improve the quality of translation and speed up the process on [translate.wordpress.org](https://translate.wordpress.org), where users can translate plugins, themes, WordPress itself and other related projects.  

PS: If you are using NoScript or Privacy Badger enable wordpress.org domain or else the extension will not work!

# Features

* Checks for:
  * missing glossary terms
  * missing start capitalization
  * missing start and end space
  * missing end hellip `…`
  * missing end symbols `; . ! : 、。؟ ？`
  * straight single `'` or double quote `"` usage 
* Highlights non-breaking-spaces
* Review translations button to show and count warnings
* Links Glossary terms to Consistency tool
* Autoloads Consistency suggestions in the editor
* Easy insertion of non-translatable items
* Bulk Actions in the footer
* Auto-save after "Copy from Original" bulk action.
* Link and scroll to locale button for the Translation Global Status
* Right column with quick Approve/Reject/Fuzzy buttons
* Character and Word counts in Meta panel
* Localized dates in the Meta panel
* QuickLinks in Meta menu - open or copy link
* Optional sticky header
* Marks older than 6 months strings - black border
* Notices counts for Approved, Rejected, Fuzzied, Submitted and Selected rows
* Daily update of the list of locales
* Anonymous author search filter
* Many hotkeys and shortcuts

## Hotkeys

| Action | Hotkey |
| -- | -- |
| Add Glossary definition in the translation area | Right click on a Glossary term |
| Add non-breaking spaces near symbols | Ctrl+Shift+X |
| Approve | Ctrl+Shift+A |
| Cancel | Ctrl+Shift+Z |
| Copy from original | Ctrl+Shift+B |
| Dismiss validation warnings for the current visible editor | Ctrl+D |
| Dismiss all validation warnings | Ctrl+Shift+D |
| Force suggest or Force save translation | Ctrl+Shift+Enter |
| Fuzzy | Ctrl+Shift+F |
| Load all consistency suggestions | Alt+C |
| Open next string editor | Page Down |
| Open previous string editor | Page Up |
| Reject | Ctrl+Shift+R |
| Suggest or Save translation | Ctrl+Enter |

## Settings
* Don’t validate strings ending with `...`, `.`, `:`
* Don’t validate strings ending with `;.!:、。؟？！`
* Don’t show a warning when the translation doesn't contain an initial uppercase letter when the original string starts with one.
* Don’t show a warning when the translation is missing a glossary term.
* Don’t visualize non-breaking-spaces in preview.
* Hide warning for initial space in translation.
* Hide warning for trailing space in translation.
* Show a warning for missing curly apostrophe in preview.
* Show a warning for using non-typographic quotes in preview (except for HTML attributes quotes).
* Auto-submit the *Copy From Original* Bulk Action (Warning: When enabled will submit all originals).
* Auto-copy original to clipboard on editor opening.
* Don’t validate strings during "Copy From Original" Bulk Action to bypass validation. (Warning: When enabled will submit originals with Glossary terms or other warnings.)

# Download

* Firefox [Instructions](https://support.mozilla.org/en-US/kb/find-and-install-add-ons-add-features-to-firefox): [Download](https://addons.mozilla.org/en-US/firefox/addon/glotdict/)
* Chrome [Instructions](https://support.google.com/chrome_webstore/answer/2664769?hl=en): [Download](https://chrome.google.com/webstore/detail/glotdict/jfdkihdmokdigeobcmnjmgigcgckljgl)

# Spell Checking?

If you are looking for spell checking we recommend [Grammarly](https://www.grammarly.com/) and [LanguageTool](https://languagetool.org/) as they both provide browser extensions for spelling and grammar checking.

# Update times and release

When the developers of the extension think that a new release is ready and tested, they create a new release and publish it on Firefox and Chrome addons stores. Then, we have to wait a few hours for Chrome and Firefox. After that, all installations will be updated automatically.

# Additional resources

## Videos

* [GlotDict – How a Browser Extension Changes Your Translation Workflow - 2016](https://wordpress.tv/2016/05/31/daniele-scasciafratte-glotdict-how-a-browser-extension-changes-your-translation-workflow/) ([Daniele Scasciafratte](https://github.com/Mte90))
* [GlotDict, Pte-Bot and BulkRejectGP – Why Your Community Needs A Glossary - 2017](https://wordpress.tv/2017/04/29/glotdict-pte-bot-and-bulkrejectgp-why-your-community-needs-a-glossary/) ([Daniele Scasciafratte](https://github.com/Mte90))
* [GlotDict demonstration - 2021](https://www.youtube.com/watch?v=lkJXBBByUKM) ([Vlad Timotei](https://github.com/vlad-timotei))

## Presentations

* [Translating english variants with GlotDict](https://docs.google.com/presentation/d/1MiJNsbv1oIIlq5tj1P-lkc5y_F4JO3mFVNwk45XevtU/present) ([Garrett Hyder](https://github.com/garretthyder)) 

# Contributors

## Maintainers

* [Daniele Scasciafratte](https://github.com/Mte90) [Donate](https://www.paypal.me/mte90)
* [Garrett Hyder](https://github.com/garretthyder) 
* [Loïc Antignac](https://github.com/webaxones)
* [Vlad Timotei](https://github.com/vlad-timotei)

## Other contributors

* [Olegs Belousovs](https://github.com/sgelob) - The ideator
* [Pascal Casier](https://github.com/ePascalC) - For the help with the glossaries and hotkeys
* [Aurélien Joahny](https://github.com/ajoah) - For all the patches
* [Jb Audras](https://github.com/audrasjb) - Ex co-Maintainer

