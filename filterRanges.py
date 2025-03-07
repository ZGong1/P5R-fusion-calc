import re
import sys

def is_address_in_range(address):
    """Check if an address is within the specified ranges."""
    try:
        addr_value = int(address, 16)
        
        # Check if in range 0x0200-0x03FF
        if 0x200 <= addr_value <= 0x3FF:
            return True
        
        # Check if in range 0x4000-0x5FFF
        if 0x4000 <= addr_value <= 0x5FFF:
            return True
        
        # Check if in range 0x6000-0x9FFF
        if 0x6000 <= addr_value <= 0x9FFF:
            return True
        
        return False
    except ValueError:
        # If conversion fails, return False
        return False

def process_file(input_filename, output_filename):
    """Process the input file and write filtered addresses to output file."""
    with open(input_filename, 'r') as infile:
        lines = infile.readlines()
    
    processed_lines = []
    
    for line in lines:
        if 'found at addresses:' in line:
            # Split into main value and addresses
            parts = line.split('found at addresses:')
            main_value = parts[0].strip()
            
            # Extract addresses using regex
            addresses = re.findall(r'0x[0-9A-Fa-f]+', parts[1])
            
            # Filter addresses to keep only those in the specified ranges
            filtered_addresses = [addr for addr in addresses if is_address_in_range(addr)]
            
            # If there are filtered addresses, reconstruct the line
            if filtered_addresses:
                new_line = f"{main_value} found at addresses: {', '.join(filtered_addresses)}\n"
                processed_lines.append(new_line)
            else:
                # If no addresses remain after filtering, don't include the line
                pass
        else:
            # Keep lines that don't contain addresses unchanged
            processed_lines.append(line)
    
    with open(output_filename, 'w') as outfile:
        outfile.writelines(processed_lines)
    
    print(f"Processed file saved to {output_filename}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python script.py input_file output_file")
        input_file = input("Enter input filename: ")
        output_file = input("Enter output filename: ")
    else:
        input_file = sys.argv[1]
        output_file = sys.argv[2]
    
    process_file(input_file, output_file)