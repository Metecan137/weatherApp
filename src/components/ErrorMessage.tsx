

function ErrorMessage({errorMessage} : {errorMessage: string}) {

    return (
        <div className="text-center mt-10 font-bold">
            {errorMessage}
        </div>
    )
}

export default ErrorMessage