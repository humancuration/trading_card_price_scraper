import pandas as pd
import requests
from bs4 import BeautifulSoup

def find_hyperlink_text(card_var, id_var, holo_var, reverse_holo_var, first_edition_var, soup):
    card_var = card_var.replace(' ', '-')  # Normalize card name
    print(f"Searching for: {card_var} with ID: {id_var}")

    # Construct potential search texts based on conditions
    search_texts = []

    if holo_var:
        search_texts.append(f"{card_var}-holo-{id_var}")
        search_texts.append(f"{card_var}-foil")
    if first_edition_var:
        search_texts.append(f"{card_var}-1st-edition-{id_var}") 
    if reverse_holo_var:
        search_texts.append(f"{card_var}-reverse-holo-{id_var}")
    
    # General search terms for fallback
    search_texts.append(f"{card_var}-{id_var}")
    search_texts.append(f"{card_var}")

    # Search for matching link text in order of priority
    for search_text in search_texts:
        result = find_link(search_text, soup)
        if result:
            return result

    print("No matching link text found")
    return None


def find_link(search_text, soup):
    links = soup.find_all('a')
    for link in links:
        href = link.get('href')  # Use get to avoid KeyError
        if href and search_text in href.split('/')[-1]:
            print(f"Found link text: {link.get_text()}")
            return href
    return None



# Function to extract table data and convert it to a dictionary
def extract_table_to_dict(final_link, card, card_id, card_count):
    # Define standard labels
    standard_labels = [
        'card', 'id', 'Ungraded', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
        'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
        'Grade 9.5', 'SGC 10', 'CGC 10', 'PSA 10', 'BGS 10',
        'BGS 10 Black', 'CGC 10 Pristine', 'final_link', 'card_count', 'img_link'
    ]
    
    try:
        response = requests.get(final_link)
        soup = BeautifulSoup(response.text, 'html.parser')
        table = soup.find(id='full-prices')
        rows = table.find_all('tr') if table else []

        table_data = {label: 'not_available' for label in standard_labels}

        # Extract data from rows
        for row in rows:
            cells = row.find_all('td')
            if len(cells) == 2:
                label, value = cells[0].get_text(strip=True), cells[1].get_text(strip=True)
                if label in table_data:
                    table_data[label] = value

        # Get the img_link from the img src property
        img_element = soup.find_all('img', {'itemprop': 'image'})[0]
        img_link = img_element['src'] if img_element else 'not_available'
        table_data['img_link'] = img_link

        # Set the final link, card, number, and card count
        table_data['final_link'] = final_link
        table_data['card'] = card
        table_data['id'] = card_id
        table_data['card_count'] = card_count
        return table_data
    except Exception as e:
        print(f"Failed to extract table, setting all prices to 'not_available'. Error: {e}")
        return {label: 'not_available' for label in standard_labels}

# Iterate through each row in the source DataFrame
def card_finder(source_df):
    # Capitalize each word in the "card" column
    source_df[['card', 'id']] = source_df[['card', 'id']].apply(lambda x: x.str.strip().str.lower())

    # Create a list to hold new rows
    new_rows = []

    for i in range(len(source_df)):
        card = source_df.iloc[i, 0]
        card_id = source_df.iloc[i, 1]
        base_url = f'https://www.pricecharting.com/search-products?q={card}+{card_id}&type=prices'
        
        response = requests.get(base_url)
        soup = BeautifulSoup(response.text, 'html.parser')

        holo = source_df.iloc[i, 2]
        reverse_holo = source_df.iloc[i, 3]
        first_edition = source_df.iloc[i, 4]
        card_count = source_df.iloc[i, 5]
        
        if 'game' in response.url:
            final_link = response.url
            df_new_rows = extract_table_to_dict(final_link, card, card_id, card_count)
        else:
            matching_link = find_hyperlink_text(card, card_id, holo, reverse_holo, first_edition, soup)
            if matching_link:
                final_link = matching_link
                df_new_rows = extract_table_to_dict(final_link, card, card_id, card_count)
            else:
                final_link = 'not_available'
                df_new_rows = {label: 'not_available' for label in [
                    'card', 'id', 'card_count', 'Ungraded', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
                    'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
                    'Grade 9.5', 'SGC 10', 'CGC 10', 'PSA 10', 'BGS 10',
                    'BGS 10 Black', 'CGC 10 Pristine', 'final_link', 'img_link']}
                df_new_rows['card'] = card
                df_new_rows['id'] = card_id
                df_new_rows['card_count'] = card_count

        # Append the new row data to the new_rows list
        new_rows.append(df_new_rows)

    # Create a DataFrame from the collected new rows
    df_new_rows = pd.DataFrame(new_rows)

    return df_new_rows
