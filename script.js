const {
  PagingState,
  SortingState,
  FilteringState,
  GroupingState,
  EditingState,
  SelectionState,
  RowDetailState,
  IntegratedSorting,
  IntegratedFiltering,
  IntegratedPaging,
  IntegratedGrouping,
  IntegratedSelection,
  DataTypeProvider } =
DevExpress.DXReactGrid;

const {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  TableSelection,
  PagingPanel,
  GroupingPanel,
  TableGroupRow,
  TableEditRow,
  TableEditColumn,
  TableRowDetail,
  DragDropProvider,
  TableColumnReordering,
  TableColumnVisibility,
  ColumnChooser,
  Toolbar } =
DevExpress.DXReactGridBootstrap3;

const { createStore, compose } = Redux;

const { Provider, connect } = ReactRedux;

const IntEditor = ({ value, onValueChange }) => /*#__PURE__*/
React.createElement(NumericInput, {
  className: "form-control",
  value: value,
  onChange: valueAsNumber => onValueChange(valueAsNumber) });



const CustomTableRowDetail = ({ row }) => /*#__PURE__*/
React.createElement("div", null, "Details about '", row.name, "' by ", row.artist);

class ReduxGrid extends React.PureComponent {
  render() {
    const {
      rows,
      columns,
      sorting,
      onSortingChange,
      currentPage,
      pageSize,
      onPageSizeChange,
      totalCount,
      allowedPageSizes,
      onCurrentPageChange,
      filters,
      onFiltersChange,
      grouping,
      onGroupingChange,
      expandedGroups,
      onExpandedGroupsChange,
      selection,
      onSelectionChange,
      expandedRows,
      onExpandedRowsChange,
      order,
      onOrderChange,
      editingRows,
      onEditingRowsChange,
      changedRows,
      onChangedRowsChange,
      addedRows,
      onAddedRowsChange,
      deletedRows,
      onDeletedRowsChange,
      commitChanges,
      hiddenColumnNames,
      onHiddenColumnNamesChange } =
    this.props;

    return /*#__PURE__*/(
      React.createElement(Grid, { rows: rows, columns: columns, getRowId: this.getRowId }, /*#__PURE__*/
      React.createElement(SortingState, { sorting: sorting, onSortingChange: onSortingChange }), /*#__PURE__*/
      React.createElement(PagingState, {
        pageSize: pageSize,
        onPageSizeChange: onPageSizeChange,
        currentPage: currentPage,
        onCurrentPageChange: onCurrentPageChange,
        totalCount: totalCount }), /*#__PURE__*/

      React.createElement(FilteringState, { filters: filters, onFiltersChange: onFiltersChange }), /*#__PURE__*/
      React.createElement(GroupingState, {
        grouping: grouping,
        onGroupingChange: onGroupingChange,
        expandedGroups: expandedGroups,
        onExpandedGroupsChange: onExpandedGroupsChange }), /*#__PURE__*/

      React.createElement(EditingState, {
        editingRows: editingRows,
        onEditingRowsChange: onEditingRowsChange,
        changedRows: changedRows,
        onChangedRowsChange: onChangedRowsChange,
        addedRows: addedRows,
        onAddedRowsChange: onAddedRowsChange,
        deletedRows: deletedRows,
        onDeletedRowsChange: onDeletedRowsChange,
        onCommitChanges: commitChanges }), /*#__PURE__*/

      React.createElement(SelectionState, {
        selection: selection,
        onSelectionChange: onSelectionChange }), /*#__PURE__*/

      React.createElement(RowDetailState, {
        expandedRows: expandedRows,
        onExpandedRowsChange: onExpandedRowsChange }), /*#__PURE__*/

      React.createElement(IntegratedSorting, null), /*#__PURE__*/
      React.createElement(IntegratedFiltering, null), /*#__PURE__*/
      React.createElement(IntegratedGrouping, null), /*#__PURE__*/
      React.createElement(IntegratedPaging, null), /*#__PURE__*/
      React.createElement(IntegratedSelection, null), /*#__PURE__*/
      React.createElement(DragDropProvider, null), /*#__PURE__*/
      React.createElement(DataTypeProvider, { for: ["year"], editorComponent: IntEditor }), /*#__PURE__*/
      React.createElement(Table, null), /*#__PURE__*/
      React.createElement(TableColumnReordering, { order: order, onOrderChange: onOrderChange }), /*#__PURE__*/
      React.createElement(TableColumnVisibility, { hiddenColumnNames: hiddenColumnNames, onHiddenColumnNamesChange: onHiddenColumnNamesChange }), /*#__PURE__*/
      React.createElement(TableHeaderRow, { showSortingControls: true, showGroupingControls: true }), /*#__PURE__*/
      React.createElement(TableFilterRow, null), /*#__PURE__*/
      React.createElement(TableSelection, { highlightRow: true }), /*#__PURE__*/
      React.createElement(TableEditRow, null), /*#__PURE__*/
      React.createElement(TableEditColumn, { showAddCommand: true, showEditCommand: true, showDeleteCommand: true }), /*#__PURE__*/
      React.createElement(TableRowDetail, { contentComponent: CustomTableRowDetail }), /*#__PURE__*/
      React.createElement(PagingPanel, { pageSizes: allowedPageSizes }), /*#__PURE__*/
      React.createElement(TableGroupRow, null), /*#__PURE__*/
      React.createElement(Toolbar, null), /*#__PURE__*/
      React.createElement(GroupingPanel, { showSortingControls: true, showGroupingControls: true }), /*#__PURE__*/
      React.createElement(ColumnChooser, null)));


  }

  getRowId(row) {
    return row.id;
  }}


// Here are the actions supported by my reducers:
const GRID_STATE_CHANGE = "GRID_STATE_CHANGE";
const GRID_PAGE_SIZE_CHANGE = "GRID_PAGE_SIZE_CHANGE";
const GRID_SAVE = "GRID_SAVE";

// These helpers (action creators) generate action objects
const gridStateChange = (stateFieldName, stateFieldValue) => ({
  type: GRID_STATE_CHANGE,
  stateFieldName,
  stateFieldValue });


const gridPageSizeChange = pageSize => ({
  type: GRID_PAGE_SIZE_CHANGE,
  pageSize });


const gridSave = ({ added, changed, deleted }) => ({
  type: GRID_SAVE,
  added,
  changed,
  deleted });


// Some helper functions for saving. I treat the state as immutable and
// I decided to implement the full logic in a good structure here - 
// if you find it confusing, please just ignore!
const rowById = (state, id) => _.find(state.rows, r => r.id === parseInt(id));

function* addFunctions(added) {
  if (!added) return;
  const addRow = (newObject, state) => {
    let largestId = state.rows.reduce((r, v) => v.id > r ? v.id : r, 0);
    return {
      ...state,
      rows: [
      ...state.rows,
      {
        ...newObject,
        id: largestId + 1 }] };



  };
  yield* added.map(a => _.partial(addRow, a));
}

function* changeFunctions(changed) {
  if (!changed) return;
  const changeRow = (id, change, state) => {
    const changedRow = rowById(state, id);
    const otherRows = _.without(state.rows, changedRow);

    return {
      ...state,
      rows: [
      ...otherRows,
      {
        ...changedRow,
        ...change }] };



  };
  for (let id in changed) yield _.partial(changeRow, id, changed[id]);
}

function* deleteFunctions(deleted) {
  if (!deleted) return;
  const deleteRow = (id, state) => {
    const deletedRow = rowById(state, id);
    return {
      ...state,
      rows: _.without(state.rows, deletedRow) };

  };
  yield* deleted.map(d => _.partial(deleteRow, d));
}

function* commitChanges(added, changed, deleted) {
  yield* deleteFunctions(deleted);
  yield* changeFunctions(changed);
  yield* addFunctions(added);
}

// The grid reducer handles the grid state
function createGridReducer(initialState) {
  return (state = initialState, action) => {
    switch (action.type) {
      case GRID_STATE_CHANGE:
        return {
          ...state,
          [action.stateFieldName]: action.stateFieldValue };

      case GRID_PAGE_SIZE_CHANGE:
        const newPage = Math.trunc(
        state.currentPage * state.pageSize / action.pageSize);

        return {
          ...state,
          currentPage: newPage,
          pageSize: action.pageSize };

      case GRID_SAVE:
        // with the help of the function generators above, this call
        // generates new state accommodating all the changes and returns it.
        return _.flow(
        Array.from(
        commitChanges(action.added, action.changed, action.deleted)))(

        state);

      default:
        return state;}

  };
}

const mapGridStateToProps = state => state;

// In this function, we generate a bunch of event handler functions for
// the grid, which use 'dispatch' to trigger actions. After the
// 'connect' call below, these event handlers will be added automatically
// to the props passed to the grid.
const mapGridDispatchToProps = dispatch => {
  const stateChangeEventHandlers = [
  { event: "onSortingChange", field: "sorting" },
  { event: "onCurrentPageChange", field: "currentPage" },
  { event: "onFiltersChange", field: "filters" },
  { event: "onGroupingChange", field: "grouping" },
  { event: "onExpandedGroupsChange", field: "expandedGroups" },
  { event: "onSelectionChange", field: "selection" },
  { event: "onExpandedRowsChange", field: "expandedRows" },
  { event: "onOrderChange", field: "order" },
  { event: "onEditingRowsChange", field: "editingRows" },
  { event: "onAddedRowsChange", field: "addedRows" },
  { event: "onChangedRowsChange", field: "changedRows" },
  { event: "onDeletedRowsChange", field: "deletedRows" },
  { event: "onHiddenColumnNamesChange", field: "hiddenColumnNames" }].
  reduce((r, v) => {
    r[v.event] = val => dispatch(gridStateChange(v.field, val));
    return r;
  }, {});
  return {
    ...stateChangeEventHandlers,
    onPageSizeChange: pageSize => dispatch(gridPageSizeChange(pageSize)),
    commitChanges: changes => dispatch(gridSave(changes)) };

};

// Here's the 'connect' call. The 'ConnectedGrid' that results will
// receive redux store data and mapped event handlers as part of its props.
const ConnectedGrid = connect(mapGridStateToProps, mapGridDispatchToProps)(
ReduxGrid);


// Initialize the grid reducer with the initial state. This includes
// the demo data as well as internal grid state, for this demo.
const gridReducer = createGridReducer({
  columns: [
  { name: "name", title: "Name" },
  { name: "artist", title: "Artist" },
  { name: "year", title: "Year" }],

  rows: [
  {
    id: 1,
    name: "Their Satanic Majesties Request",
    artist: "The Rolling Stones",
    year: 1967 },

  { id: 2, name: "Prime Cuts", artist: "David Bowie", year: 1983 },
  { id: 3, name: "Human", artist: "Rag'n'Bone Man", year: 2017 },
  { id: 4, name: "Kill 'Em All", artist: "Metallica", year: 1983 },
  {
    id: 5,
    name: "Colour by Numbers",
    artist: "Culture Club",
    year: 1983 },

  {
    id: 6,
    name: "Born in the U.S.A.",
    artist: "Bruce Springsteen",
    year: 1984 },

  { id: 7, name: "Disraeli Gears", artist: "Cream", year: 1967 },
  {
    id: 8,
    name: "Between the Buttons",
    artist: "The Rolling Stones",
    year: 1967 },

  {
    id: 9,
    name: "Sgt. Pepper's Lonely Hearts Club Band",
    artist: "The Beatles",
    year: 1967 },

  {
    id: 10,
    name: "The Battle of Los Angeles",
    artist: "Rage Against the Machine",
    year: 1999 },

  { id: 11, name: "The Slim Shady LP", artist: "Eminem", year: 1999 }],

  sorting: [{ columnName: "name", direction: "asc" }],
  currentPage: 0,
  totalCount: 0,
  pageSize: 10,
  allowedPageSizes: [0, 5, 10, 20],
  filters: [],
  grouping: [],
  expandedGroups: [],
  selection: [],
  expandedRows: [],
  order: ["name", "artist", "year"],
  editingRows: [],
  addedRows: [],
  changedRows: {},
  deletedRows: [],
  hiddenColumnNames: [] });


const store = createStore(
gridReducer,
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


ReactDOM.render( /*#__PURE__*/
React.createElement("div", null, /*#__PURE__*/
React.createElement(Provider, { store: store }, /*#__PURE__*/
React.createElement(ConnectedGrid, null))),


document.getElementById("app"));