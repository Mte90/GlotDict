#!/usr/bin/python3

import sys
import os
import json
import zipfile

print("Browser Extension packager by Mte90")
print("The only parameter required is the folder path!")


def zipdir(path, name, browser):
    zipf = zipfile.ZipFile(name, 'w', zipfile.ZIP_DEFLATED)
    exclude_prefixes = ['__', '.', 'eslint', 'tests']  # list of exclusion prefixes
    exclude_suffixes = ['.xpi', '.zip', '.py', 'ISSUE_TEMPLATE.md', 'README.md']  # list of exclusion suffix
    for dirpath, dirnames, filenames in os.walk(path):
        # exclude all dirs/files starting/endings
        dirnames[:] = [dirname
                       for dirname in dirnames
                       if all([dirname.startswith(string) is False
                              for string in exclude_prefixes])
                       is True]
        filenames[:] = [filename
                       for filename in filenames
                       if (all([filename.startswith(string) is False for string in exclude_prefixes]))
                       and (all([filename.endswith(string) is False for string in exclude_suffixes]))
                       is True]
        for file_found in filenames:
            zipf.write(os.path.join(dirpath, file_found))
    zipf.close()


if len(sys.argv) > 1 and os.path.isdir(sys.argv[1]):
    manifest = sys.argv[1] + '/manifest.json'
    if os.path.isfile(manifest):
        with open(manifest) as content:
            data = json.load(content)
            name = data['name'].replace(' ', '-') + '_v' + data['version']
            zipdir(sys.argv[1], name + '.xpi', 'firefox')
            print("- Firefox WebExtension Package done!")
            # convert manifest v2 to v3
            os.system('cp ' + sys.argv[1] + '/manifest.json ' + sys.argv[1] + '/__manifest.json ')
            # change parameters
            data['background']['service_worker'] = data['background']['scripts'][0]
            del data['background']['scripts']
            data['resources'] = data['web_accessible_resources']
            del data['web_accessible_resources']
            data['manifest_version'] = 3

            with open(manifest, 'w') as new_manifest:
                json.dump(data, new_manifest, indent=4)
            zipdir(sys.argv[1], name + '.zip', 'chrome')

            # restore the original manifest
            os.system('rm ' + sys.argv[1] + '/manifest.json')
            os.system('mv ' + sys.argv[1] + '/__manifest.json ' + sys.argv[1] + '/manifest.json')
            print("- Chrome Extension Package done!")
    else:
        print("The file" + manifest + " not exist")
        sys.exit()
else:
    print("Path not found")
    sys.exit()


