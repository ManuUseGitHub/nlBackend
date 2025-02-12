# Generate CSV from API

## Endpoint Details
- **Resource**: `/files`
- **Method**: `GET`
- **Query Parameters**:  
  - **Static Value**: `column=static value`  
    Adds a column with a static value to the resulting CSV.  
  - **Adaptable Value (via Regular Expression)**:  
    Use the following format for adaptable query parameters:  
    ```text
    column=~/regex/flags
    ```  
    - **Format Breakdown**:
      - Start with a **tilde** (`~`).
      - Follow with the **regular expression** enclosed in **forward slashes** (`/`).
      - Optionally, include **regex flags** after the final slash.  
    - **Example**:  
      ```text
      columnX=~/^(?<columnX>`val1`|`val2`|`valN`)/i
      ```  
      This query parameter dynamically adds the column `columnX` to the CSV. Whenever a match occurs with `val1`, `val2`, or `valN`, the corresponding value is extracted and populated in `columnX`.

## Example Request
```http
GET http://host:port/6a736f6e2f5631/files?theme=de opvoedinging&article=~/^(?<article>de|het)\s/i&person=~/\s*(?<person>jij|we|ze|uw|je)\s/i
```

### Explanation
- **Query Parameters**:
  - `theme=de opvoedinging`: Adds a static "theme" column with the value `de opvoedinging`.
  - `article=~/^(?<article>de|het)\s/i`: Adds an "article" column and extracts values matching `de` or `het` (case-insensitive).
  - `person=~/\s*(?<person>jij|we|ze|uw|je)\s/i`: Adds a "person" column and extracts values matching `jij`, `we`, `ze`, `uw`, or `je` (case-insensitive).

## Example Request 2
```http
POST http://localhost:3000/6a736f6e2f5631/files?french&article=~/^(?<article>de|het)\s/i&person=~/\s*(?<person>jij|we|ze|uw|je)\s/i&!type=~/^(?<verb>[\w]%2ben)$|^(?<task>[tT]aak:.%2b)$|^(?<sentence>(?:s%27)?[A-Z][^?!.]*[!?.]{1,3})$|^(?<words>(?:[^\s]%2b\s){2,}[^\s]%2b)|^(?<noun>\w%2b)$/i&theme=Eten %26 drinken&_article=flower&_person=flower&_theme=fupper&_dutch=fcapital&_type=fupper
``` 