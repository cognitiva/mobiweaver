============
Installation
============

The mobiweaver package includes ABAP code that needs to be installed in the Netweaver server as well as javascript files that can be served either from the Netweaver or from other web server. 

The javascript files are distributed as normal code text files (for development or debugging) or minimized code files (for production deployment). These files can be served from any webserver, the demo applications link directly to a CDN resource but the files can also be easily installed in Netweaver as BSP resouces (details in XXX).


Install ABAP code
=================

The ABAP code is distributed as saplink files. To import these files into a Netweaver server the saplink program must be installed, together with some of the needed plugins. The distribution includes a nugget (saplink serialization format) for the mobiweaver services and other bundles for the demo applications.


Install Saplink
---------------
Saplink is a program that manages the export and import of ABAP objects in Netweaver servers. The mobiweaver ABAP components are distributed using this technology and so Saplink needs to be installed first. 

The first install is the saplink main program [1] that has installation instructions in [2] (tested with saplink 0.1.4). Be sure to activate all objects after importing the nugg file.

Saplink plugins need to be installed for support of other objects not included in the core distribution. In order to install the mobiweaver services the following plugins are needed:
- CLAS_ZSAPLINK_BSP.slnk  
- CLAS_ZSAPLINK_BSP_EXTENSIONS.slnk 
- CLAS_ZSAPLINK_FUNCTIONGROUP.slnk
- CLAS_ZSAPLINK_SICF.slnk
- NUGG_SAPLINK_DDIC.nugg

These plugins can be download from [3]. We also make available a zip file with the plugins for those that don't have SVN installed [4].

To install the Slinkees (slnk files) execute ZSAPLINK and choose the Slinkee tab. Then choose import and the slnk file. For the nugg file the operation is similar, but on the Nugget tab. Activate all objects after the install.

[1] http://code.google.com/p/saplink/
[2] https://wiki.sdn.sap.com/wiki/display/ABAP/SAPlink+User+Documentation
[3] https://cw.sdn.sap.com/cw/sources/1150
[4] http://cogni.bitbucket.org/mobiweaver/saplink_plugins_mobiweaver.zip


Install Mobiweaver Nuggets
--------------------------

Start by creating the following packages:

- Y_MOBIWEAVER (for the mobiweaver services)
- Y_MOBIWEAVER_SAMPLE_NWDEV  (for the sample applications that run NW developer edition, or any NW server like ECC )
- Y_MOBIWEAVER_SAMPLE_ECC  (for the sample applications that run ECC servers )

To create packages use SE80, then choose "Edit Object", choose "Development coordination" tab then choose the package name and the create button.

To install the Mobiweaver Nuggets:
- first the MOBIWEAVER.nugg file 
- MOBIWEAVER_SAMPLES_NWDEV.NUGG for the sample applications that run in the free Netweaver Dev Edition [5] or any Netweaver based server (like ECC, SCM, etc)
- MOBIWEAVER_SAMPLES_ECC.NUGG for sample applications that run in ECC

Activate the dictionary objects and activate all imported code (one way is to use SE80, menu environment -> inactive objects and then activate all objects in the left tree). Also activate the new nodes in transaction SICF (nodes under /sap/bc/bsp/sap/ with names starting with YWM).

Troubleshooting:
- The SICF plugin may not be able to overwrite the object and Saplink fails the import. If that happens delete the SICF node manually in transaction code SICF, on /sap/bc/bsp/sap/ymw*. 

[5] http://www.sdn.sap.com/irj/scn/nw-downloads

Testing
-------
- Check in SICF that the mobiweaver nodes ( /sap/bc/bsp/sap/ymw* ) are active. If not, activate using the context menu
- Open one of the sample BSP applications (example ymwdemotcode), enter the main.do controller and copy the URL to a browser window

Troubleshooting BSP
-------------------
- Check the FQDN setup [6]
- Check if the SICF nodes are active [7]:


http://wiki.sdn.sap.com/wiki/display/BSP/Fully+Qualified+Domain+Name+%28FQDN%29
http://help.sap.com/saphelp_nw70ehp1/helpdata/en/46/d28dfa34bb12bee10000000a1553f7/content.htm