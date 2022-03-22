import React, { useState, useEffect } from 'react';
import { Text, View, Pressable, Alert } from 'react-native';
import styles from '../style/style';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const board = [];
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const NBR_OF_POINTS = 6;
const POINTS_TO_BONUS = 63

export default function Gameboard() {
    const [nrbOfThrowsLeft, setNrbOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('');
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [selectedPoints, setSelectedPoints] = useState(new Array(NBR_OF_POINTS).fill(false));
    const [sum, setSum] = useState(new Array(NBR_OF_POINTS+1).fill(0));
    const [pointIcon, setPointIcon] = useState([]);
    const [pointTotal, setPointTotal] = useState(0);
    const [bonus, setBonus] = useState("You are" + POINTS_TO_BONUS +"points away from bonus")


    // function to get all point icons
    function initializePointIcons() {
        let start = [];
        for (let i = 0; i < NBR_OF_POINTS+1; i++) {
            start[i] = "numeric-" + i + "-circle";
        }
        setPointIcon(start)
    }

    // A function to select dices
    function selectDice(i) {
        if (nrbOfThrowsLeft === NBR_OF_THROWS) {
            setStatus("Throw the dices first")
        } else {
            let dices = [...selectedDices];
            dices[i] = selectedDices[i] ? false : true;
            setSelectedDices(dices)
        }
    }

    // Calculate sum of the dices that match selected point
    function getSum(props) {        
        let sum = 0;
        for (let i = 0; i < NBR_OF_DICES; i++) {
            let number = Number(board[i].slice(5));
            if (number === props) {
                sum+=props
            }
        }
        return sum;
    }

    // A function to select points
    function selectPoints(i) {
        if (selectedPoints[i]) {
            setStatus('Point already chosen, choose different')
        } else if (nrbOfThrowsLeft === 0) {
            let points = [...selectedPoints];
            points[i] = true;       
            if (selectedPoints[0] === false) {
                points[0] = true
            }
            setSelectedPoints(points);

            let sums = [...sum];
            sums[i] = getSum(i);
            setSum(sums);
            IsGameover();
            setNrbOfThrowsLeft(NBR_OF_THROWS);
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        } else {
            setStatus('Throw 3 times before setting points')
        }

    }

    // Calculate total points and points until bonus
    function TotalPoints(){
        let total = 0;
        sum.forEach(n => total += n)
        let toBonus = POINTS_TO_BONUS - total;
        if (total >= POINTS_TO_BONUS) {
            setPointTotal(total + 50)
            setBonus("You got the bonus!")
        } else {
            setPointTotal(total);
            setBonus("You are " + toBonus + " points away from bonus.")
        }
    }

    // Function to throw dices
    function throwDices() {
        if (nrbOfThrowsLeft > 0){
            for (let i = 0; i < NBR_OF_DICES; i++) {
                if (!selectedDices[i]) {
                    let randomNumber = Math.floor(Math.random() * 6 + 1 )
                    board[i] = 'dice-' + randomNumber;
                }
        }
            setNrbOfThrowsLeft(nrbOfThrowsLeft-1);
        } else {
            setStatus('Really, choose points')
        }
    }

    function NewGame() {
        setNrbOfThrowsLeft(NBR_OF_THROWS);
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        setSelectedPoints(new Array(NBR_OF_POINTS).fill(false));
        setSum(new Array(NBR_OF_POINTS+1).fill(0));
        setPointTotal(0);
        setBonus("You are " + POINTS_TO_BONUS +" points away from bonus.")
    }

    const showAlert = () => {
        Alert.alert(
            "Game over",
            "You got " + pointTotal + " points, yay!  " + bonus,
            [
                {
                    text: "New game",
                    onPress: () => NewGame()
                }
            ]
            );
    }

    function IsGameover(){
        if (selectedPoints.every(val => val == true)) {
            showAlert()
        }
    }

    useEffect(() => {
        if (nrbOfThrowsLeft === NBR_OF_THROWS) {
            initializePointIcons();
            setStatus('Throw dices');
        } if (nrbOfThrowsLeft < NBR_OF_THROWS) {
            setStatus('Keep throwing');
        } if (nrbOfThrowsLeft == 0) {
            setStatus('Choose points');
        }
        TotalPoints()
        IsGameover()
    }, [sum, nrbOfThrowsLeft]);

    // Row of dices
    const row = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        row.push(
            <Pressable
                key={"row" + i}
                onPress={() => selectDice(i)}
                >
                <MaterialCommunityIcons
                    name={board[i]}
                    key={"row" + i}
                    size={50}
                    color={selectedDices[i] ? "black" : "seagreen"}>
                </MaterialCommunityIcons>
            </Pressable>
        );
    }

    // Row of Points and point icons
    const numberRow = [];
    for (let i = 1; i < NBR_OF_POINTS +1; i++) {
        numberRow.push(
            <Pressable
                key={"numberRow" + i}
                onPress={() => selectPoints(i)}
                style={styles.points}
                >
                <Text>{sum[i]}</Text>
                <MaterialCommunityIcons
                    name={pointIcon[i]}
                    key={"numberRow" + i}
                    size={30}
                    color={selectedPoints[i] ? "black" : "seagreen"}>
                </MaterialCommunityIcons>
            </Pressable>
        );
    }

    return  (
        <View style={styles.gameboard}>
            <View style={styles.flex}>{row}</View>
            <Text style={styles.gameinfo}>Throws left: {nrbOfThrowsLeft}</Text>
            <Text style={styles.gameinfo}>{status}</Text>
            <Pressable style={styles.button} 
                onPress={()=>throwDices()}>
                <Text style={styles.buttonText}>Throw dices</Text>
            </Pressable>
            <Text style={styles.total}>Total points: {pointTotal}</Text>
            <Text style={styles.gameinfo}>{bonus}</Text>
            <View style={styles.flex}>{numberRow}</View>
        </View>
    )
}
