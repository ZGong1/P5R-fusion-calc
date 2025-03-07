def filter_addresses_ending_in_0(input_file, output_file):
    """
    Reads a file containing memory addresses and writes a new file
    that only includes addresses ending in 0.
    """
    with open(input_file, 'r') as f_in:
        lines = f_in.readlines()
    
    filtered_lines = []
    current_section = []
    
    for line in lines:
        # Keep header lines and empty lines
        if not line.strip() or not any(x in line for x in ["0x", "found at addresses"]):
            filtered_lines.append(line)
            continue
            
        # If we found a line with addresses
        if "found at addresses:" in line:
            value_part = line.split("found at addresses:")[0].strip()
            addresses_part = line.split("found at addresses:")[1].strip()
            
            # Split all addresses and filter only those ending in '0'
            addresses = addresses_part.split(", ")
            filtered_addresses = [addr for addr in addresses if addr.endswith('0')]
            
            # Only append the line if there are any filtered addresses
            if filtered_addresses:
                new_line = f"{value_part} found at addresses: {', '.join(filtered_addresses)}\n"
                filtered_lines.append(new_line)
                
        else:
            filtered_lines.append(line)
    
    # Write the filtered content to the output file
    with open(output_file, 'w') as f_out:
        f_out.writelines(filtered_lines)

# Example usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python script.py input_file output_file")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    filter_addresses_ending_in_0(input_file, output_file)
    print(f"Filtered addresses written to {output_file}")