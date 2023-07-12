const InputForm = ({ label, name, error, ...rest }) => {
  return (
    <div className="mb-3">
      <label htmlFor={name.toUpperCase()} className="form-label">
        {label}
      </label>
      <input
        {...rest}
        name={name}
        className="form-control"
        id={name.toUpperCase()}
      />
      {error && <div className="form-text text-danger">{error}</div>}
    </div>
  );
};

export default InputForm;
