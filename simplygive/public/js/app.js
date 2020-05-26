import { React, ReactDOM } from "https://unpkg.com/es-react@16.8.60/index.js";
import htm from "https://unpkg.com/htm@2.2.1/dist/htm.mjs";
const html = htm.bind(React.createElement);

function Product(props) {
    const product = props.product;
    return html`
      <div key=${product.id} className="col-lg-4 col-md-6 col-mb-4">
        <a class="nav-link" href="${product.url}&tag=effortlessgif-20">
        <div className="card h-100">
        <img
        src=${product.imageURL}
           className="card-img-top"
           alt="bootstraplogo"
         /> 
          <div className="card-body">
            <h5 className="card-title">${product.name}</h5>
            <p className="card-text">$${product.price}</p>
            <div
              onClick=${() =>
                setShoppingCartQuantity(
                  product,
                  currentQuantity => currentQuantity + 1
                )}
              className="btn btn-primary"
            >
              Add to Cart
            </div>
          </div>
        </div>
        </a>
      </div>
    `;
  }

function SortCriteria(props) {
  // The below uncommented line is the same as:
  // const name = props.name;
  // const checked = props.checked
  const { name, checked, onSortPropChange } = props;
  const id = `sort-${name}`;
  return html`
    <span className="sort-prop mx-2">
      <input
        onChange=${e => onSortPropChange(e.target.checked, name)}
        checked=${checked}
        className="mx-1"
        type="radio"
        id=${id}
        name="sortbyprop"
      />
      <label className="mx-1" htmlFor=${id}>${name}</label>
    </span>
  `;
}

function SortingOptions(props) {
  const {
    product,
    sortProp,
    onSortPropChange,
    sortOrder,
    onSortOrderChange
  } = props;
  // props to exclude from the sort
  const propsExcludedFromSort = new Set(["id", "category", "url", "imageURL", "entertainment", "personalCare", "sport", "craft"]);
  const searchableProps = Object.keys(product)
    // filter out excluded props
    .filter(keyProperty => !propsExcludedFromSort.has(keyProperty))
    // map the keys/props to React Components.
    .map(
      (keyProperty, index) => html`
        <${SortCriteria}
          key=${keyProperty}
          name=${keyProperty}
          onSortPropChange=${onSortPropChange}
          checked=${keyProperty === sortProp}
        />
      `
    );
  return html`
    <div className="col-md-12 row">
      <div className="col-md-6">
        Sort By:
        <br />
        ${searchableProps}
      </div>
      <div className="col-md-6">
        Sort:
        <br />
        <span className="mx-2">
          <input
            onChange=${e => onSortOrderChange(e.target.checked, "ascending")}
            className="mx-1"
            type="radio"
            checked=${sortOrder === "ascending"}
            id="sort-ascending"
            name="sortorder"
          />
          <label className="mx-1" htmlFor="sort-ascending">Ascending</label>
        </span>
        ${" "}
        <span className="mx-2">
          <input
            onChange=${e => onSortOrderChange(e.target.checked, "descending")}
            className="mx-1"
            checked=${sortOrder === "descending"}
            type="radio"
            id="sort-descending"
            name="sortorder"
          />
          <label className="mx-1" htmlFor="sort-descending">Descending</label>
        </span>
      </div>
    </div>
  `;
}

function sortProducts(products, sortProp, sortOrder) {
  return products.sort((focusedProduct, alternateProduct) => {
    const moveFocusedProductLeft = -1,
      moveFocusedProductRight = 1,
      dontMoveEitherProduct = 0;
    if (focusedProduct[sortProp] < alternateProduct[sortProp]) {
      if (sortOrder === "ascending") {
        // move focusedProduct left of alternateProduct
        return moveFocusedProductLeft;
      } else {
        // move focusedProduct right of alternateProduct
        return moveFocusedProductRight;
      }
    } else if (focusedProduct[sortProp] > alternateProduct[sortProp]) {
      if (sortOrder === "ascending") {
        // move focusedProduct right of alternateProduct
        return moveFocusedProductRight;
      } else {
        // move focusedProduct left of alternateProduct
        return moveFocusedProductLeft;
      }
    } else {
      // Both products are equal don't move either.
      return dontMoveEitherProduct;
    }
  });
}

function Products(props) {
  const [sortProp, setSortProp] = React.useState("name");
  const [sortOrder, setSortOrder] = React.useState("ascending");
  const products = sortProducts(props.products, sortProp, sortOrder);
  return html`
    <div className="col-12 row">
      <div className="col-12 row">
        <${SortingOptions}
          product=${props.products[0]}
          sortProp=${sortProp}
          sortOrder=${sortOrder}
          onSortPropChange=${(isChecked, sortProperty) => {
            if (isChecked && sortProp != sortProperty) {
              setSortProp(sortProperty);
            }
          }}
          onSortOrderChange=${(isChecked, sortOrdering) => {
            if (isChecked && sortOrdering != sortOrder) {
              setSortOrder(sortOrdering);
            }
          }}
        />
      </div>
      <div className="col-12 row">
        ${products.map(function(product) {
          return html`
            <${Product} key=${product.id} product="${product}" />
          `;
        })}
      </div>
    </div>
  `;
}

function PeopleItem(props) {
  const item = props.peopleitem;
  return html`
    <div className="row p-2">
      <div className="flex-direction-column p-2">
        <h6 className="">${item.name}</h6>
      </div>
    </div>
  `;
} 

function People(props) {
  const items = props.people;
  return html`
        ${items.length === 0 ? "No profiles made" : ""}
        ${items.map(
          peopleitem =>
            html`
            <div>
            <button className="btn btn-outline-success my-2 my-sm-0"
            onClick=${e => 
              {narrowProducts(peopleitem.entertainment, peopleitem.personalCare, peopleitem.sport, peopleitem.craft);}}
             ${PeopleItem} key=${peopleitem.id} peopleitem=${peopleitem} > ${peopleitem.name}
          </button>
          </div>
            `
        )}
  `;
}

function DropDownItems(props) {
  return html`
    <div>
      <${People} people=${props.people} />
    </div>
  `;
}

function TopBar() {
  return html`
    <div className="row align-items-center">
      <${Search} />
    </div>
  `;
}

function Search() {
  const [searchTerm, setSearchTerm] = React.useState("");
  return html`
    <form
      id="search"
      onSubmit=${e => {
        e.preventDefault();
        filterProducts(searchTerm);
      }}
      className="form-inline my-2 my-lg-0"
    >
      <input
        value=${searchTerm}
        onChange=${eventData => setSearchTerm(eventData.target.value)}
        className="form-control mr-sm-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
      />
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
        Search
      </button>
    </form>
  `;
}
// create a copy of products;
let filteredProducts;
function filterProducts(searchTerm) {
  filteredProducts = products.products.filter(product => {
    const lowerSearchTerm = searchTerm;
    return (
      product.category.toLowerCase().includes(lowerSearchTerm) ||
      product.name.toLowerCase().includes(lowerSearchTerm)
    );
  });

  render();
}
function narrowProducts(entertain, personal, sports, crafts) {
  filteredProducts = products.products.filter(product => {
    return (
      product.entertainment != null && entertain == '1' ||
      product.personalCare != null && personal == '1' ||
      product.sport != null && sports == '1' ||
      product.craft != null && crafts == '1' 
    );
  });

  render();
}

let allPeople;

window.render = function render() {
  ReactDOM.render(
    html`
      <${Products} products=${filteredProducts} />
    `,
    document.getElementById("displayproductsdiv")
  );
  ReactDOM.render(
    html`
      <${TopBar} />
    `,
    document.getElementById("search")
  );
  ReactDOM.render(
    html`
      <${DropDownItems} people=${allPeople} />
    `,
    document.getElementById("peoplediv")
  );
};

fetch('/api/People').then(response => {
  if (response.ok) {
      return response.json();
  } else {
      throw Error("Something went wrong with that request:", response.statusText);
  }
}).then(function (data) {
  window.people = data;
  allPeople = people.people.slice();
  render();
});

fetch('/api/Products').then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw Error("Something went wrong with that request:", response.statusText);
    }
}).then(function (data) {
  window.products = data;
  filteredProducts = products.products.slice();
  render();
});