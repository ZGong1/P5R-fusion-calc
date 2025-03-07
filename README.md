# how it works
    From what I have gathered, all persona uids are stored as hex starting with 0x01-00-0#-##
    ### is the UID of the persona in hex from this [website](https://amicitia.miraheze.org/wiki/Persona_5_Royal/Personas)
    Once you only count uid's that show up in these hex ranges:
         - 0x4xxx-0x5xxx
         - 0x6xxx-0x9xxx
    It includes **all** registered non special personas
    The only issues so far are that special fusion personas don't show up, and sometimes there are random personas listed that aren't actually in the compendium
    WIP


# how to run
    find your save file in %appdata%/sega (steam only ~~for now~~)
    use this [website](https://www.save-editor.com/tools/pc_game_save_converter_title_Persona_5_Royal.html?utm_source=chatgpt.com) to decode DATA.DAT save file 
    get your dec.dat file from the website output
    first un extractUniqueAllAddr.py with the .dec as your input and anything as your text output
    This should output a text file with every potential persona uid found within the decoded save file
    Next run filterChanges.py previous_output.txt new_output.txt
    This should give a *mostly* accurate list of personas in the compendium


# TODO
     - make one python script to do both previous ones combined
     - Include names from the table found on miraheze.org in the output file
     - See if different save files actually have consistent addresses for the compendium area I have identified
     - new script that allows you to sort the "filtered" output by what is actually in your compendium
     - remove low range (redundant)
     - last nibble of address found HAS to be 0. I think this sorts out everything properly