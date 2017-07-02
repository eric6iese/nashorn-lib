#!/bin/bash

# Does an automatic update of this linux (ubuntu,debian) vm
# Should be done regularily as a maintenance run and be simpler to execute than the graphical interface
# A nice advantage of this one is that it also automatically removes unused stuff (unlike the ui one)

# Fetch new package lists
sudo apt-get -y update

# Update existing packages
sudo apt-get -y upgrade

# Update new packages or new dependencies
sudo apt-get -y dist-upgrade

# Remove no longer used stuff
sudo apt-get -y autoremove
exit 0