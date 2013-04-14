This simple Chrome extension adds an icon (i.e., a Page Action) inside the address bar when you browse an Amazon Machine Image via http://aws.amazon.com/amis or http://aws.amazon.com/amazon-linux-ami/. Clicking the icon reveals a popup with the AMI IDs for each region in a Mappings format that may be pasted into a CloudFormation template for quick lookup.

# Installation
1. Download ami-cfn-mappings.crx
2. Open the Extensions panel in Chrome Settings
3. Drag and drop ami-cfn-mappings.crx into the Extensions panel to install

# Install from source
1. Clone this repository

		git clone https://github.com/evandbrown/ami-cfn-mappings.git
2. Open the Extensions panel in Chrome Settings
3. Enable Developer Mode by ticking the 'Developer Mode' checkbox
4. Click 'Load Unpackaged Extension' and choose the folder cloned in Step 1 above
