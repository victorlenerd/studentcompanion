import { StyleSheet } from 'react-native';

export const colors = {
    primary: "#02709c",
    accent: "#ff8d10",
    white: "#ffffff",
    gray: "#cccccc",
    red: "rgba(236,12,12, 0.8)",
    yellow: "#f1c40f",
    green: "#2ecc71",
    lightBlue: "#F5F6F7", 
    black: "#1a1a1a"
};

export const main = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: colors.lightBlue,
    },
    content: {
        padding: 20
    },
    toolbar: {
        height: 50,
        backgroundColor: colors.white
    },
    label: {
        fontSize: 14,
        color: '#abafb3'
    },
    errLabel: {
        fontSize: 12,
        color: '#d83f40'
    },
    textInput: {
        height: 50,
        marginBottom: 25
    },
    textArea: {
        height: 150
    },
    nav: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 20,
        height: 50,
        borderBottomColor: "#eee",
        borderBottomWidth: 1                        
    },
    nav_image: {
        marginRight: 20,
        width: 18,
        height: 18
    },
    nav_item: {
        fontSize: 18,
        borderColor: colors.gray,
        color: colors.black
    },
    nav_item_active: {
        fontSize: 18,
        color: colors.black,
        borderColor: colors.black,
    },
    emptyState: {
        width: 300,
        height: 300,
        borderRadius: 300,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
        marginBottom: 1,
        padding: 40,
    },
    emptyStateText: {
        color: "#e8e8e8",
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30
    },
    fabHome: {
        position: "absolute",
        bottom: 100,
        zIndex: 100,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    Fab: {
        width: 50,
        height: 50,
        marginBottom: 10,
        borderRadius: 25,
        elevation: 5,
        backgroundColor: colors.accent,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 3
        },
        shadowOpacity: 0.3
    },
    fabIcon: {
        width: 22,
        height: 22
    },
    getStartedLogo: {
        width: 100,
        height: 100,  
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 3
        },
        shadowOpacity: 0.3
    },
    button: {
        padding: 10,
        margin: 10,
        borderRadius: 2,
        elevation: 3,
        backgroundColor: colors.primary,
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 3
        },
        shadowOpacity: 0.3
    },
    buttonInActive: {
        padding: 10,
        margin: 10,
        borderRadius: 2,
        elevation: 3,
        backgroundColor: colors.gray,
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 3
        },
        shadowOpacity: 0.3
    },
    buttonAccent: {
        padding: 10,
        margin: 10,
        borderRadius: 2,
        elevation: 3,
        backgroundColor: colors.accent,
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 3
        },
        shadowOpacity: 0.3
    },
    buttonText: {
        textAlign: "center",
        color: colors.white,
        fontSize: 16
    },
    blackButton: {
        width: 60,
        height: 60,
        padding: 10,
        margin: 10,
        borderRadius: 30,
        elevation: 2,
        backgroundColor: colors.black
    },
    blackButtonText: {
        textAlign: "center",
        color: colors.white,
        fontSize: 16
    },
    fbButton: {
        backgroundColor: "#3b5998",
        padding: 10,
        margin: 10,
        borderRadius: 2,
        elevation: 2,
    }
});

export const intro = StyleSheet.create({
    slide: {
        flex: 1,
        backgroundColor: "#FFF",
        flexDirection: "column",
    },
    image: {
        height: 100, 
        width: 100, 
        marginTop: 50
    },
    title: {
        fontSize: 22,
        color: "#000"
    },
    slideTop: {
        flex: 0.5, 
        backgroundColor: colors.accent,
        justifyContent: 'center',
        alignItems: 'center'
    },
    slideBottom: {
        flex: 0.5, 
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    info: {
        textAlign: "center",
        fontSize: 32,
        color: colors.white,
        fontWeight: "300",
        marginTop: 50,
        marginBottom: 80
    }
});

export const pass = StyleSheet.create({
    passDisplay: {
        padding: 5,
        backgroundColor: "#fff",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 80
    },
    passBtns: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    passBtnsRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    passBtn: {
        flex: .2,
        margin: 1,
        backgroundColor: "#1a1a1a",
        flexDirection: 'column',
        justifyContent: 'center'
    },
    passDoneBtn: {
        flex: .2,
        margin: 1,
        backgroundColor: "#2ECC71",
        flexDirection: 'column',
        justifyContent: 'center'
    },
    passClearBtn: {
        flex: .2,
        margin: 1,
        backgroundColor: "#F1C40F",
        flexDirection: 'column',
        justifyContent: 'center'
    },
    passBtnTxt: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center"
    },
    passDisplayTxt: {
        flex: 1,
        fontSize: 22,
        marginTop: 8,
    }
});

export const Toolbar = StyleSheet.create({
    navBar: {
        backgroundColor: colors.white,
        elevation: 2
    },
    title: {
       color: colors.black,
       marginTop: 5
    },
    statusBar: {
        backgroundColor: colors.accent,
    }
});
