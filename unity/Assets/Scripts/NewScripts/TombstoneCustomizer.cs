using UnityEngine;
using TMPro;

public class TombstoneCustomizer : MonoBehaviour
{
    [Header("UI Elements")]
    public TMP_InputField nameInput;
    public TMP_InputField dateInput;
    public TMP_InputField quoteInput;

    public GameObject inputPanel;
    public GameObject modelSelectionPanel;
    public GameObject materialSelectionPanel;

    public GameObject crossModel, slabModel, rectangleModel, roundModel;

    private TextMeshPro nameTMP, dateTMP, quoteTMP;
    private Renderer currentModelRenderer;

    void Start()
    {
        if (!nameInput || !dateInput || !quoteInput)
        {
            Debug.LogWarning("⚠ One or more TMP_InputFields are not assigned in the Inspector.");
        }

        modelSelectionPanel?.SetActive(false);
        materialSelectionPanel?.SetActive(false);
    }

    public void OnSubmitTextFields()
    {
        inputPanel?.SetActive(false);
        modelSelectionPanel?.SetActive(true);
    }

    public void OnModelSelected(string modelType)
    {
        crossModel?.SetActive(false);
        slabModel?.SetActive(false);
        rectangleModel?.SetActive(false);
        roundModel?.SetActive(false);

        nameTMP = null;
        dateTMP = null;
        quoteTMP = null;

        GameObject selectedModel = null;

        switch (modelType)
        {
            case "Cross":
                selectedModel = crossModel;
                break;
            case "Slab":
                selectedModel = slabModel;
                break;
            case "Rectangle":
                selectedModel = rectangleModel;
                break;
            case "Round":
                selectedModel = roundModel;
                break;
        }

        if (selectedModel != null)
        {
            selectedModel.SetActive(true);
            nameTMP = selectedModel.transform.Find("NameText")?.GetComponent<TextMeshPro>();
            dateTMP = selectedModel.transform.Find("DateText")?.GetComponent<TextMeshPro>();
            quoteTMP = selectedModel.transform.Find("QuoteText")?.GetComponent<TextMeshPro>();
            currentModelRenderer = selectedModel.GetComponent<Renderer>();

            ApplyTextToTombstone();
        }
        else
        {
            Debug.LogWarning("⚠ Unknown model type selected or missing model reference.");
        }
    }

    void ApplyTextToTombstone()
    {
        if (nameTMP != null && nameInput != null)
        {
            nameTMP.text = nameInput.text;
            nameTMP.gameObject.SetActive(true);
            nameTMP.ForceMeshUpdate();
        }

        if (dateTMP != null && dateInput != null)
        {
            dateTMP.text = dateInput.text;
            dateTMP.gameObject.SetActive(true);
            dateTMP.ForceMeshUpdate();
        }

        if (quoteTMP != null && quoteInput != null)
        {
            quoteTMP.text = string.IsNullOrEmpty(quoteInput.text) ? "" : $"\"{quoteInput.text}\"";
            quoteTMP.gameObject.SetActive(true);
            quoteTMP.ForceMeshUpdate();
        }
    }

    public void OnNextButtonPressed()
    {
        modelSelectionPanel?.SetActive(false);
        materialSelectionPanel?.SetActive(true);
    }

    public void OnMaterialSelected(Material selectedMaterial)
    {
        if (currentModelRenderer != null && selectedMaterial != null)
        {
            currentModelRenderer.material = selectedMaterial;
        }
    }

    public void OnDoneButtonPressed()
    {
        if (currentModelRenderer != null)
        {
            PlayerPrefs.SetString("TombstoneModel", currentModelRenderer.gameObject.name);
            PlayerPrefs.SetString("Material", currentModelRenderer.material.name);
        }

        PlayerPrefs.SetString("Name", nameInput?.text);
        PlayerPrefs.SetString("Date", dateInput?.text);
        PlayerPrefs.SetString("Quote", quoteInput?.text);
        PlayerPrefs.Save();

        Debug.Log("✅ Changes Saved!");
    }
}
