import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Pressable } from 'react-native';
import styles from '../style/style';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Col, Row, Grid } from "react-native-easy-grid";

const board = [];
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const NBR_OF_POINTS = 6;

export default function Gameboard() {
    const [nrbOfThrowsLeft, setNrbOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('');
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [selectedPoints, setSelectedPoints] = useState(new Array(NBR_OF_POINTS).fill(false));
    const [sum, setSum] = useState(new Array(NBR_OF_POINTS+1).fill(0));
    const [pointIcon, setPointIcon] = useState([]);


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
        if (nrbOfThrowsLeft === 0 && !selectedPoints[i]) {
            let points = [...selectedPoints];
            points[i] = selectedPoints[i] ? false : true;
            setSelectedPoints(points);

            let sums = [...sum];
            sums[i] = getSum(i);
            setSum(sums);
            setNrbOfThrowsLeft(NBR_OF_THROWS);
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
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
            setStatus("Choose points")
        }
    }

    useEffect(() => {
        if (nrbOfThrowsLeft === NBR_OF_THROWS) {
            initializePointIcons();
            setStatus('Throw dices');
        } if (nrbOfThrowsLeft < NBR_OF_THROWS) {
            setStatus("Keep throwing")
        }if (nrbOfThrowsLeft < 0) {
            setNrbOfThrowsLeft(NBR_OF_THROWS-1);
        }
    }, [nrbOfThrowsLeft]);

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
                // disabled={pointIcon[i] === selectedPoints[i] ? "true" : "false"}
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
            <View style={styles.flex}>{numberRow}</View>
        </View>
    )
}
