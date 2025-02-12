from glob import glob

all_files = glob("../static/images/*png") + glob("../static/images/*jpg")

f = open( 'all_images.js', 'w' )
f.write( 'var all_images = ' + repr(all_files) + '\n' )
f.close()
