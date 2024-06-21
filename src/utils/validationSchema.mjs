export const createUserValidationSchema = {
    username: {
        isLength:{
            option: {
                min: 5,
                max: 32,
            },
            errorMessage:
                "Username must be alteast 5 - 32 chars",
        },
        notEmpty: {
            errorMessage: "Username cannot be empty",
        },
        isString: {
            errorMessage: "Username must be a string"
        },
    },
    displayName: {
        notEmpty: {
            errorMessage: true
        }
    }
}

export const getUserValidationSchema = {
    filter: {
        isLength: {
            option:{
                min: 5,
                max: 10
            },
            errorMessage: "Filter should be of 5 - 10 chars"
        },
        isString: {
            errorMessage: "Filter should be a string"
        },
        notEmpty: {
            errorMessage: "Filter should not be empty"
        }
    }
}