import re
import binascii
import argparse

def find_hex_pattern(input_file, output_file):
    # Read the input file in binary mode
    with open(input_file, 'rb') as f:
        data = f.read()
    
    # Convert binary data to a hex string
    hex_data = binascii.hexlify(data).decode('utf-8')
    
    # Pattern to match: 0100####, where #### is any 4 hex digits (2 bytes)
    pattern = re.compile(r'0100([0-9a-f]{4})')
    
    # Find all matches
    matches = pattern.finditer(hex_data)
    
    # Track all occurrences of each unique value
    value_occurrences = {}
    
    # Process matches
    for match in matches:
        # Extract the #### part (the captured group)
        value = match.group(1)
        
        # Skip if the value is 0000
        if value == "0000":
            continue
            
        # Skip if the value represents 0 in different formats
        try:
            if int(value, 16) == 0:
                continue
        except ValueError:
            pass  # In case of parsing errors, don't skip
        
        # Reverse the byte order (endianness)
        # Split into 2-character chunks (bytes) and reverse the order
        bytes_list = [value[i:i+2] for i in range(0, len(value), 2)]
        reversed_value = ''.join(bytes_list[::-1])
        
        # Only keep values that start with "0" after byte swapping
        if not reversed_value.startswith("0"):
            continue
        
        # Get the position in the original binary
        position = match.start() // 2
        
        # Add this position to the list of occurrences for this value
        if reversed_value not in value_occurrences:
            value_occurrences[reversed_value] = []
        value_occurrences[reversed_value].append(position)
    
    # Sort unique values by value for consistent output
    sorted_values = sorted(value_occurrences.items())
    
    # Write all occurrences to output file
    with open(output_file, 'w') as f:
        f.write(f"Found {len(value_occurrences)} unique values:\n\n")
        
        for value, positions in sorted_values:
            # Format hex addresses
            hex_positions = [f"0x{pos:X}" for pos in positions]
            # Join all positions with commas
            positions_str = ", ".join(hex_positions)
            
            # Format the output to show the reversed #### part and all its positions
            f.write(f"0x{value} found at addresses: {positions_str}\n")
    
    return len(value_occurrences)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Find all occurrences of unique #### values in hex patterns matching 0x0100####.')
    parser.add_argument('input', help='Input .dec file')
    parser.add_argument('output', help='Output file for results')
    args = parser.parse_args()
    
    count = find_hex_pattern(args.input, args.output)
    print(f"Found {count} unique values. Results written to {args.output}")