using UnityEngine;
using TMPro;

public class InputCollector : MonoBehaviour
{
    public TMP_InputField nameInput;
    public TMP_InputField dateInput;
    public TMP_InputField quoteInput;

    public void SubmitInputs()
    {
        string name = nameInput.text;
        string date = dateInput.text;
        string quote = quoteInput.text;

        Debug.Log($"Name: {name}, Date: {date}, Quote: {quote}");
    }
}
