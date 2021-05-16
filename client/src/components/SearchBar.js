import React, { Component } from "react";

class SearchBar extends Component {
  render() {
    return (
      <div id="header-search-bar" className="col m4 l4 xl4">
        <form >
          <div className="input-field">
            {/*
            <div className="input-field-wrapper">

              <label className="label-icon" htmlFor="search">
                <i className="material-icons">search</i>
              </label>
                <input placeholder="Search" id="search" type="search" required />

                <i className="material-icons">close</i>
            </div>
            */}
          </div>
        </form>
      </div>
    );
  }
}

export default SearchBar;
