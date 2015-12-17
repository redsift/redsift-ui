#!/bin/bash

# Requires ImageMagick with WebP support
# brew install imagemagick --with-jp2 --with-webp --with-hdri 
# If already installed, uninstall and re-install
# Refs: https://even.li/imagemagick-sharp-web-sized-photographs/
# http://www.imagemagick.org/script/command-line-options.php#quality

set -e

IM_FLAGS="-strip -units PixelsPerInch"
WEBP_OPS="-define webp:auto-filter=true -define webp:method=6 -define webp:image-hint=photo"
JPEG_OPS="-interlace Plane"

OUTPUTS=("_c" "_c_2x" "" "_2x")
FILEFLAGS=("-resize 480 -unsharp 4x1.4+0.7+0 -quality 90" "-resize 960 -unsharp 3x0.6+0.7+0 -quality 85" "-resize 1024 -density 96 -unsharp 3x0.6+0.7+0 -quality 85" "-resize 2048 -density 300 -quality 90")
FILEFLAGS_J=("$JPEG_OPS" "$JPEG_OPS" "$JPEG_OPS" "$JPEG_OPS")
FILEFLAGS_P=("$WEBP_OPS" "$WEBP_OPS" "$WEBP_OPS" "$WEBP_OPS")

SILENT=0
FORCE=0

function usage {
   cat << EOF
Usage: forweb.sh -h <file> <destination>
	
	-s 	Silent
	-h	Print this message

Munges image for the web
EOF
}

while getopts fsh option; do 
	case "${option}" in 
		h)
			usage;
			exit 1
			;;
		s) 
			SILENT=1
			;; 		
		f) 
			FORCE=1
			;; 				
		\?) echo "Option -$OPTARG is invalid" >&2
			exit -1
			;; 		
	esac 
done

shift $(($OPTIND - 1))

IMG=$1
DST=$2
FIL=`basename "$IMG"`
if [ -d "$DST" ]
then
	echo "Using output folder $DST"
else
	FIL=`basename "$DST"`
	DST=`dirname "$DST"`
	
	echo "Using output folder $DST and base filename $FIL"
fi

# FEXT="${FIL##*.}"
FNAME="${FIL%.*}"

for i in ${!OUTPUTS[@]}; do
	OUT="${OUTPUTS[$i]}"
	FILEFLAG="${FILEFLAGS[$i]}"
	FILEFLAG_J="${FILEFLAGS_J[$i]}"
	FILEFLAG_P="${FILEFLAGS_P[$i]}"

	IMGOUT_J="$DST/$FNAME$OUT.jpg"
	IMGOUT_P="$DST/$FNAME$OUT.webp"
#	echo "$IMGOUT"
	if [ $FORCE -ne 1 ]  
	then
	if [ -e "$IMGOUT" ]
	then
		echo "File $IMGOUT already exists" >&2
		exit -2
	fi
	fi
	convert "$IMG" $FILEFLAG $IM_FLAGS $FILEFLAG_J "$IMGOUT_J"
	convert "$IMG" $FILEFLAG $IM_FLAGS $FILEFLAG_P "$IMGOUT_P"
	if [ $SILENT -ne 1 ] ; then identify "$IMGOUT_J" "$IMGOUT_P" ; fi
done