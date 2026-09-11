using UnityEngine;
using TMPro;

public class TombTextAutoUpdater : MonoBehaviour
{
    [Header("Input Fields")]
    public TMP_InputField nameInput;
    public TMP_InputField dateInput;
    public TMP_InputField quoteInput;

    [Header("Tombstone Tag")]
    public string tombstoneTag = "TombstoneModel"; // Updated tag

    private TextMeshPro currentNameTMP;
    private TextMeshPro currentDateTMP;
    private TextMeshPro currentQuoteTMP;

    // Call this after model is selected to find and store references
    public void CacheTextFieldsFromActiveModel()
    {
        GameObject[] tombstones = GameObject.FindGameObjectsWithTag(tombstoneTag);

        foreach (GameObject tomb in tombstones)
        {
            if (tomb.activeSelf) // Make sure model is active
            {
                TextMeshPro[] texts = tomb.GetComponentsInChildren<TextMeshPro>(true);

                foreach (TextMeshPro tmp in texts)
                {
                    string lower = tmp.name.ToLower();

                    if (lower.Contains("name"))
                        currentNameTMP = tmp;

                    else if (lower.Contains("date"))
                        currentDateTMP = tmp;

                    else if (lower.Contains("quote"))
                        currentQuoteTMP = tmp;
                }

                // Initially hide the texts (making them inactive or disabling)
                if (currentNameTMP != null) currentNameTMP.gameObject.SetActive(false);
                if (currentDateTMP != null) currentDateTMP.gameObject.SetActive(false);
                if (currentQuoteTMP != null) currentQuoteTMP.gameObject.SetActive(false);

                return;
            }
        }

        Debug.LogWarning("No active tombstone found during cache.");
    }

    // Call this when a model is selected (e.g., button press or UI interaction)
    public void OnModelSelected(GameObject selectedModel)
    {
        // Make the selected model visible
        selectedModel.SetActive(true);

        // Cache the TMP references for this model
        CacheTextFieldsFromActiveModel();
    }

    // Called when typing in the name input field
    public void OnNameChanged(string input)
    {
        if (currentNameTMP != null)
        {
            currentNameTMP.text = input;
            currentNameTMP.gameObject.SetActive(true); // Show text when user types
            currentNameTMP.ForceMeshUpdate(); // Force update
        }
    }

    // Called when typing in the date input field
    public void OnDateChanged(string input)
    {
        if (currentDateTMP != null)
        {
            currentDateTMP.text = input;
            currentDateTMP.gameObject.SetActive(true); // Show text when user types
            currentDateTMP.ForceMeshUpdate(); // Force update
        }
    }

    // Called when typing in the quote input field
    public void OnQuoteChanged(string input)
    {
        if (currentQuoteTMP != null)
        {
            currentQuoteTMP.text = string.IsNullOrWhiteSpace(input) ? "" : $"“{input}”";
            currentQuoteTMP.gameObject.SetActive(true); // Show text when user types
            currentQuoteTMP.ForceMeshUpdate(); // Force update
        }
    }

    // Optional: Final apply before save or switch
    public void UpdateActiveTombText()
    {
        OnNameChanged(nameInput.text);
        OnDateChanged(dateInput.text);
        OnQuoteChanged(quoteInput.text);
    }

    // Call this in Start() or when the scene is loaded
    void Start()
    {
        // Hide all models initially
        GameObject[] tombstones = GameObject.FindGameObjectsWithTag(tombstoneTag);
        foreach (GameObject tomb in tombstones)
        {
            tomb.SetActive(false); // Hide all tombstone models
        }
    }
}
