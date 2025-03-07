import re
import binascii
import argparse

def find_hex_pattern(input_file, output_file):
    # Read the input file in binary mode
    with open(input_file, 'rb') as f:
        data = f.read()
    
    # Convert binary data to a hex string
    hex_data = binascii.hexlify(data).decode('utf-8')
    
    # Pattern to match: 0x0100##00, where ## is any hex value
    # In the hex string, this would appear as "0100" followed by any two hex digits, followed by "00"
    pattern = re.compile(r'0100[0-9a-f]{2}00')
    
    # Find all matches
    matches = pattern.finditer(hex_data)
    
    # Write matches to output file
    with open(output_file, 'w') as f:
        for match in matches:
            # Extract the match
            match_str = match.group(0)
            # Get the position in the original binary (each hex char represents half a byte)
            position = match.start() // 2
            # Format the output
            f.write(f"Found pattern: 0x{match_str} at position: {position}\n")
    
    return len(re.findall(pattern, hex_data))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Find hex patterns matching 0x0100##00 in a file.')
    parser.add_argument('input', help='Input .dec file')
    parser.add_argument('output', help='Output file for results')
    args = parser.parse_args()
    
    count = find_hex_pattern(args.input, args.output)
    print(f"Found {count} matches. Results written to {args.output}")