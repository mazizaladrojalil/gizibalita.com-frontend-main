function GlobalFilter(props) {
  const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = props;

  return (
    <div class="input-group">
      <input 
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder={`Cari data`}
        class="form-control py-4 border-right-0 border" style={{alignContent:"center", boxShadow:"0px 6px 0px 0px #ffb4b4", border:"1px solid #b14444"}}/>
      
</div>
    // <label className="flex gap-x-10 items-baseline">
    //   <input
    //     type="text"
    //     className="rounded-md border-gray-100 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    //     value={globalFilter || ''}
    //     onChange={(e) => setGlobalFilter(e.target.value)}
    //     placeholder={`${count} data...`}
    //   />
    // </label>
  );
}

export default GlobalFilter;
