# 2.0.2

* Enhancement: Shows always the link of the changelog
* Fix: Projects to translate label mispositioned
* Enhancement: Back to top icon.
* Enhancement: Sticky useful tools header.
* Enhancement: Improved modern coding standards.
* Enhancement: Simpler settings description and shortcuts design.
* Enhancement: "What's new" tab.
* Enhancement: Setting, Auto-copy original to clipboard on editor opening.

This versions could not exists without the huge work of Loïc Antignac and Vlad Timotei
that imported features from their browser extensions and co-maintain this tool!

# 2.0.1

* Fix: Missing changelog file was crashing the extension

# 2.0.0

* Enhancement: Back to top icon.
* Enhancement: Sticky useful tools header.
* Enhancement: Improved modern coding standards.
* Enhancement: Simpler settings description and shortcuts design.
* Enhancement: "What's new" tab.
* Enhancement: Setting, Auto-copy original to clipboard on editor opening.
* Fix: Message if no locale is chosen.
* Fix: Mark older than 6 months strings.
* Fix: Mark strings with glossary terms.
* Fix: Right click on glossary terms for plural strings.

This versions could not exists without the huge work of Loïc Antignac and Vlad Timotei
that imported features from their browser extensions and co-maintain this tool!

# 1.7.0

* Fix: strings count after Done pressure
* Fix: Next editor is now open after translation change
* Enhancement: Ctrl+Shift+N remapped to Ctrl+Shift+X because is a hotkey used by browsers
* Enhancement: Show Consistency translation in the editor panel
* Enhancement: New hotkey to load the Consistency translation
* Enhancement: New buttons on the editor for history link, copy and consistency
* Enhancement: Show Review button also for non PTE/GTE

# 1.6.10

* Enhancement: Improved buttons on the string list
* Enhancement: Add glossary link to buttons
* Fix: Blue border lost after translation
* Fix: Scroll button on stats that don't target the right locale 

# 1.6.9

* Bugfix: Sidebar's buttons in case of no new lines works badly
* Enhancement: Scroll to locale in Project Stats improved
* Enhancement: Move current locale at first place on Translate homepage

# 1.6.8

* Bugfix: Avoid opening the next row on using the side buttons

# 1.6.7

* Enhancement: New code for the side buttons approve/reject/fuzzy that avoid fails on submitting 

# 1.6.6

* Fix: On stats page for locales with formal/informal version

# 1.6.5

* Update: DOMPurify updated for security reasons (reported by Mozilla)

# 1.6.4

* Update: DOMPurify updated for security reasons (reported by Mozilla)

# 1.6.3

* Fix: Re-added support for non-pte users

# 1.6.2

* Fix: Removed contextmenus permission because it was useless

# 1.6.1

* Fix: On approving a string the row status wasn't changed
* Fix: Hotkey for copying now works with multiple textarea

# 1.6.0

* Fix: Place the review buttin the right place
* Fix: Patched internal jquery library
* Enhancement: In listing view the curly apostrophe is now highlighted if the warning is disabled

# 1.5.7

* Fix: Auto close opened box on Accept/Reject/Fuzzy

# 1.5.6

* Fix: Add support to the legend again

# 1.5.5

* Fix: Update support for the new interface of Translate.WordPress.org
* Removed: Blocker for Social networks in Firefox because not necessarily

# 1.5.4

* Fix: Update support for the new interface of Translate.WordPress.org

# 1.5.3

* Fix: better position of scroll button on specific pages

# 1.5.2

* Fix: wrong link on "Projects to translate"
* Enhancement: "Scroll to " only on stats page

# 1.5.1

* Enhancement: Full width page also for non-PTE users
* Enhancement: Catch count notice before GlotDict loading
* Fix: Update selected count notice on 'Copy from Original'

# 1.5

* Feature: New Ctrl+Shift+Enter keybinding to force submission.
* Feature: Added setting to change 'Copy from Original' Bulk Action behavior to auto-submit selected strings.
* Enhancement: Improve Review Process to provide a notice with error and row counts as well as a complete state.
* Fix: Ignore the context label on "Copy from Original"
* Fix: Update review process to use .has-warnings class instead of just red bg to align better with GlotPress styling.
* Fix: Introduce delay in "Copy From Original" when autosubmitting to avoid RACE conditions.
* Enhancement: Added setting to allow bypassing validating during the "Copy From Original" Bulk Action.
* Fix: Added an isolated dismiss Hotkey which only affects the currently visible editor.
* Fix: Added target="_blank" rel="noreferrer noopener" to links introduced by GlotDict
* Enhancement: Added link to Grammarly and LanguageTool as suggested spell checkers.
* Fix: Updated String Counts to cover Plural & Multi-plural strings
* Fix: Updated the "Copy from Original" logic to trigger a change on the textarea so as to prompt the string counts be updated.
* Fix: Updated the ellipsis validation warning and logic to allow for the ellipsis character.

# 1.4.3

* Feature: Added notices to track counts in real-time for Approved, Rejected, Fuzzied, Submitted and Selected strings
* Enhancement: Add validation for initial space
* Fix: Ignore symbols on uppercase first letter validator

# 1.4.2

* Enhancement: Updated keybindings for consistency. 
* Enhancement: New keybindings: Ctrl+Shift+R to reset all GlotDict settings and Ctrl+Shift+D to dismiss all the validation warnings.
* Fix: Incorrect Word Count
* Fix: Suppress Translated String count on untranslated strings

# 1.4.1

* Fix: Approve button on the column wasn't working
* Enhancement: Width of 85% only on the string list

# 1.4
* Feature: New Ctrl+Alt+D hotkey to dismiss warnings
* Feature: New bulk action to Copy from original
* Feature: New validator for non tipographic quotes
* Feature: Width of the view is 85%
* Feature: Count words section
* Enhancement: Add bulk footer only when is missing
* Enhancement: Removed alert for a GlotPress notice
* Enhancement: Rewritten part of GlotDict actions to use GlotPress JS API

# 1.3.26
* Fix: Support for last changes of Translate.WordPress.org
 
# 1.3.25
* Improvement: Detection of space for non-highlight spaces

# 1.3.24
* Fix: Non-Highlight rendered only on the first time

# 1.3.23
* Fix: Not render tag inside preview if non-breaking space is enabled
* Improvement: less code for highlight non-breaking spaces

# 1.3.22
* Fix: Fixed the hotkey for non-breaking spaces

# 1.3.21
* Enhancement: Improved consistency in the text

# 1.3.20
* Enhancement: Changed label text to a better italish ehm english!

# 1.3.19
* Improvement: Improved code style
* Fix: Validation conflicts with GlotPress/GlotDict warning

# 1.3.18
* Improvement: Added missing trailing space warning
* Fix: Since previous release the settings panel wasn't clickable

# 1.3.17
* Improvement: Highlight non-breaking space in details panel
* Improvement: Option to hide info message

# 1.3.16
* Fix: Warning for curly apostrophe instead on straight

# 1.3.15
* Fix: On new translation after 1.3.14

# 1.3.14
* Improvement: Alert to remind to dimiss warning to add new translation

# 1.3.13
* Improvement: New label for terms validation
* Fix: Issue on validation of terms

# 1.3.11
* Improvement: DomPuriy updated to the original file js
* Fix: Issue on saving the translation

# 1.3.10
* Improvement: DomPuriy updated to 1.0.2

# 1.3.9
* Improvement: Highlight non-braking-space by @audrasjb
* Improvement: A11y label on settings page by @audrasjb

# 1.3.8
* Feature: Black border on old strings (6 months)
* Feature: Added layover for waiting on loading of the extension
* Feature: Highlight non-braking-space as settings GlotPress/801

# 1.3.7
* Feature: Hide new buttons on untranslated strings
* Feature: Hide buttons where not permitted
* Feature: Add Bulk Action on the footer 
* Improvement: Add message remainder on bigger screen to open the settings
* Fix: Show everytime the column with buttons

# 1.3.6
* Feature: New column with Approve, Reject and Fuzzy buttons

# 1.3.5
* Fix: Not loading extension on new install

# 1.3.4
* Fix: Alert on click again for review

# 1.3.3
* Fix: Support for case insensitive on terms
* Fix: Search for all the translations
* Improvement: Change the text on the button to Review in progress

# 1.3.2
* Feature: Alert for first letter uppercase missing on translation
* Feature: Alert for missing glossary term translation
* Feature: Review mode for errors (new button)
* Fix: Missing marked string that have terms inside
* Fix: Improvement on final dots detection

# 1.3.1
* Fix: Link for Translation Global Status link
* Fix: For Page Up/Down
* Feature: Discard link on GlotDict alert
* Feature: Warning on empty translation
* Remove: Tooltip custom support

# 1.2.7
* Fix: Remove support of Firefox in Chrome

# 1.2.6
* Fix: Better social block for Firefox
* Improvement: Few fix

# 1.2.5
* Fix: Remove duplicate translate message on first run

# 1.2.4
* Fix: Link to consistency for brazilian
* Fix: For wrong encode

# 1.2.3
* Fix: The locales list was not auto updating

# 1.2.2
* Fix: Removed code for migration

# 1.2.1
* Fix: Error on migration to 1.2.0

# 1.2.0
* Generator of glossary: Improvement for terms with multiple words
* Generator of glossary: Support to the new glotpress
* Feature: New amazing settings panel
* Feature: Hotkey for fuzzy button
* Improvement: Code organized better!
* Improvement: Code quality improved!

# 1.1.21
* Fix: for missing dots in words for no-european languages

# 1.1.20
* Fix: for missing loading of extension

# 1.1.19
* Improvement: Fix from the last release

# 1.1.18
* Improvement: Detect if string ends with ... and suggest &hellip;

# 1.1.17
* Fix: null text on first installation removed
* Improvement: Check if the new string finish with a .?! if the original finish with that
* Improvement: loading js system

# 1.1.16
* Improvement: anitization
* Fix: plurals

# 1.1.15
* Improvement: Sanitize the values inside
* Improvement: Support for plurals out-the-box

# 1.1.14
* Improvement: Disable the GlotPress official hotkeys

# 1.1.13
* Fix: legend

# 1.1.12
* Fix: On Chrome in few cases the library for hotkeys is not loaded in the right order
* Fix: Improvement on the css selector for the blue legend
* Improvement: The glossary update in few cases was updated only with a refresh

# 1.1.11
* Fix: final space on Copy from original
* Improvement: New RegExp to detect better the words
* Feature: Rows with GlotDict terms are now marked in the list

# 1.1.10
* Fix: bugs on words inside ()
* Fix: other sanitizations
* Improvement: Now check if the content is different to avoid many DOM operations
* Improvement: Now validate the HTML to avoid broken strings
* Improvement: Now there is a file for tests the extension

# 1.1.9
* Fix: bugs on  single words

# 1.1.8
* Fix: bugs on multiple cases on french and german

# 1.1.7
* Fix: Bug on multiple terms near each other

# 1.1.6
* Fix: Bug on Germany fixed
* Fix: Bug for consistency link with language like Japan

# 1.1.5
* Fix: The date on glossary update
* Add link to Consistency tool on terms
* On right click on the term with glossary is appended in the text in translation
* Text for new insttallation to look on the readme
* Improved Readme

# 1.1.4 
* Improvement: Show the date of the last update
* Improvement: ctrl+alt+r reset all the GlotDict settings
* Fix: Problems with terms with parenthesis (happen in ES)
* Fix: For new user the alert system was not working

# 1.1.3
* Improvement: The FB, Twitter and Google+ button are not loaded


# 1.1.2
* Improvement: If there is only one string is opened automatically
* Fix: Remove the ' on comments to avoid problems
* Added: da_DK language in the code

# 1.1.1
* Little fix to force the glossary download in few cases

# 1.1.0
* Improvement: Auto update glossary system!
* Improvement: The FB, Twitter and Google+ button in the bottom of WP.org are removed to speed up the loading of the page
* Improvement: Added link to Home page about project to translate of the language choosen
* Improvement: Added link Translation Global Status
* Improvement: Added button to scroll to the language configured in Translation Global Status page
* Improvement: Better code naming, organizations, improvements
* Fixed: Hotkeys duplicated
* Removed: sk_SK because the glotpress glossary it is not complete

# 1.0.9
* Fix: New internal system to detect shortcut
* Feature: Shortcut on Ctrl+Shift+B copy the original by ePascalC

# 1.0.8
* Fix: Better regular expression to ignore nested terms
* Fix: Ignore browser hotkey shortcut
* Fix: Support multiple definitions for the same term
* Enhancement: Alert with hotkeys when the string is not visible
* Enhancement: New glossaries: ast
* Feature: Shortcut on Ctrl+Shift+F to replace space near symbols by ePascalC

# 1.0.7
* Glossaries generated with GLotDictJSON now contain also the `pos` value
* Enhancement: New glossaries: tr_TR
* Feature: Shortcut on Ctrl+Shift+Z to click "Cancel"
* Feature: Shortcut on Ctrl+Shift+A to click "Approve"
* Feature: Shortcut on Ctrl+Shift+R to click "Reject"

# 1.0.6
* Fix for terms detection near <>() symbols
* Fix alignment of toolbar for PTE
* Enhancement: New UI on first use
* Enhancement: No default language on first use
* Feature: Shortcut on Ctrl+Enter to click "Suggest new translation" or "Add translation"
* Feature: Shortcut on Page Down to open the previous string to translate
* Feature: Shortcut on Page Up to open the next string to translate
* Enhancement: New glossaries: he_IL, ro_RO, th, en_AU, en_CA
* New icon by CrowdedTent

# 1.0.5
* Fix remember the language chosen now is working at 100%
* New glossaries: bg,ja,es,fi,hi,ja,lt,sk,sv

# 1.0.4
* New glossaries for German, French, Dutch
* Updated Italian glossary
* Fix for missing translation
* Improved accessibility

# 1.0.3
* Fix for PTE users on translate.wordpress.org

# 1.0.2
* Fix for Firefox for the JSON load
* Force save of locale on dropdown
* Improvement on detection in case of different case letter of the terms

# 1.0.1
* Few fixes

# 1.0.0
* First Release
