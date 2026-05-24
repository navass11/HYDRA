# Script to download SOILGRIDS data.
#
# This data can be downloaded manually through soilgrids.org. 
# This script is provided to keep code and workflow traceable.
# Based on: https://www.geeksforgeeks.org/downloading-files-web-using-python/
# And: https://stackoverflow.com/questions/34291665/how-to-grab-a-tiff-image-from-python

# modules etc
import requests
import os        # to check if file already exists

# specify locations
loc_src= "https://files.isric.org/soilgrids/former/2017-03-10/data/"
loc_des = "E:/SURINAM/01_DATA/04_DATOS_GEOGRAFICOS/02_SOIL/"

# specify a list of files to download
file_list = [
    'README.md',
    'META_GEOTIFF_1B.csv',
    'SNDPPT_M_sl1_250m_ll.tif',
    'SNDPPT_M_sl2_250m_ll.tif',
    'SNDPPT_M_sl3_250m_ll.tif',
    'SNDPPT_M_sl4_250m_ll.tif',
    'SNDPPT_M_sl5_250m_ll.tif',
    'SNDPPT_M_sl6_250m_ll.tif',
    'SNDPPT_M_sl7_250m_ll.tif',
    'SLTPPT_M_sl1_250m_ll.tif',
    'SLTPPT_M_sl2_250m_ll.tif',
    'SLTPPT_M_sl3_250m_ll.tif',
    'SLTPPT_M_sl4_250m_ll.tif',
    'SLTPPT_M_sl5_250m_ll.tif',
    'SLTPPT_M_sl6_250m_ll.tif',
    'SLTPPT_M_sl7_250m_ll.tif',
    'CLYPPT_M_sl1_250m_ll.tif',
    'CLYPPT_M_sl2_250m_ll.tif',
    'CLYPPT_M_sl3_250m_ll.tif',
    'CLYPPT_M_sl4_250m_ll.tif',
    'CLYPPT_M_sl5_250m_ll.tif',
    'CLYPPT_M_sl6_250m_ll.tif',
    'CLYPPT_M_sl7_250m_ll.tif',
    'SNDPPT_M_sl1_250m_ll.tif.xml',
    'SNDPPT_M_sl2_250m_ll.tif.xml',
    'SNDPPT_M_sl3_250m_ll.tif.xml',
    'SNDPPT_M_sl4_250m_ll.tif.xml',
    'SNDPPT_M_sl5_250m_ll.tif.xml',
    'SNDPPT_M_sl6_250m_ll.tif.xml',
    'SNDPPT_M_sl7_250m_ll.tif.xml',
    'SLTPPT_M_sl1_250m_ll.tif.xml',
    'SLTPPT_M_sl2_250m_ll.tif.xml',
    'SLTPPT_M_sl3_250m_ll.tif.xml',
    'SLTPPT_M_sl4_250m_ll.tif.xml',
    'SLTPPT_M_sl5_250m_ll.tif.xml',
    'SLTPPT_M_sl6_250m_ll.tif.xml',
    'SLTPPT_M_sl7_250m_ll.tif.xml',
    'CLYPPT_M_sl1_250m_ll.tif.xml',
    'CLYPPT_M_sl2_250m_ll.tif.xml',
    'CLYPPT_M_sl3_250m_ll.tif.xml',
    'CLYPPT_M_sl4_250m_ll.tif.xml',
    'CLYPPT_M_sl5_250m_ll.tif.xml',
    'CLYPPT_M_sl6_250m_ll.tif.xml',
    'CLYPPT_M_sl7_250m_ll.tif.xml']

# loop over the list and download each item
for item in file_list:

    # if file already exists in destination, move to next file
    if os.path.isfile(loc_des + item):
        continue

    # specify the url to get
    file_url = loc_src + item

    # Make sure the connection is re-tried if it fails
    retries_max = 10
    retries_cur = 1
    while retries_cur <= retries_max:
        try: 

            # write the contents of the response (r.content) to file ...
            with open(loc_des + item,"wb") as f:

                # Send a HTTP request to the server and save the HTTP response in a response object called r 
                # 'stream = True' ensures that only response headers are downloaded initially (and not all file contents too, which are 2GB+)
                r = requests.get(file_url, stream = True)

                # ... by iterating over specific chunks and saving those
                for chunk in r.iter_content(chunk_size=1024):
                    f.write(chunk)

            # print a completion message
            print('Successfully downloaded ' + file_url)

        except:
            print('Error downloading ' + file_url + ' on try ' + str(retries_cur))
            retries_cur += 1
            continue
        else:
            break