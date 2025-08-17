const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.addEventListener('input', (event) => {
      this.performSearch(event.target.value);
    });

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.addEventListener('click', () => {
      this.clearSearch();
    });

    document.body.appendChild(searchInput);
    document.body.appendChild(clearButton);
  }

  performSearch(query) {
    this.query = query;
    console.log(`Searching for: ${this.query}`);
  }

  clearSearch() {
    this.query = '';
    document.querySelector('input[type="text"]').value = '';
    console.log('Search cleared');
  }
}

const searchBar = new SearchBar();